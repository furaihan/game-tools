# Testing checklist

Two parts: where to look for bugs while you're already instrumented (cheap, do this during Part 1 step 7), and what categories of tests to write once you know what's broken (Part 2 of the main skill).

## Where bugs hide (scan for these while instrumented)

These are cheap to check once you already have a harness running — each one took only a few extra minutes in the river-generator review that this skill was extracted from, and two of them turned up real, previously-unknown bugs.

- **Hedge-word comments.** Grep for "should", "usually", "rarely", "hopefully", "shouldn't happen", "in theory", "edge case:", "TODO", "FIXME", "hack". A comment hedging about behavior is often the author flagging a spot they weren't fully confident in — and often there's no test actually verifying the hedge holds. (Real example: a comment reading "thin rivers get eaten if iterations rise — keep at 1" was correct that thin widths are risky, but nothing tested it, and width=1 turned out to already be reachable from the UI and already broken.)
- **Magic numbers / hardcoded caps.** Fixed constants like a queue size, a retry/attempt limit, a recursion depth cap, a timeout — test behavior right at, and just past, the cap. These are places where "works for the cases I tried" silently stops being true.
- **Silent fallback paths.** Any `if (somethingUnexpected) { doSafeThing() }` branch — instrument *how often* the fallback actually fires under normal operation. It's easy for a "defensive, should rarely trigger" path to become the common case (e.g. a connectivity-check budget too small for realistic input sizes, so the "rare" fallback fires on 94% of runs instead of the intended <1%).
- **Requested-vs-delivered mismatches.** Any time a function takes a "give me N of X" parameter (N branches, N retries, N items), verify the output actually contains N — spacing/uniqueness/attempt-cap constraints can silently deliver fewer with no error or warning.
- **Boundary clamping.** Any `Math.max(0, Math.min(bound, x))`-style clamp — check whether clamping introduces a discontinuity (a snap/jump) rather than a graceful constraint, especially for anything meant to look continuous or smooth.
- **Parameters whose valid UI/API range includes values the algorithm doesn't actually handle well.** If a slider allows 1-20 but the algorithm only behaves correctly for 4+, that gap is a bug regardless of whether it's "technically" in range.

## Test categories to write

- **Regression tests.** Encode the specific bug you just fixed so it can't silently come back. For anything probabilistic, this is a statistical assertion over many seeds ("fraction of runs showing the bad pattern stays below X%"), not a single hand-picked input — a single-seed assertion for a probabilistic bug just tests that one seed, not the underlying rate.
- **Statistical / property tests.** For randomness, generative algorithms, or invariants (determinism given a fixed seed, output always within declared bounds, conservation of some count, idempotence), assert the property holds across many generated inputs. Look for existing "doesn't crash" tests that could be strengthened into "produces statistically sane output" tests with only a small addition.
- **Edge cases.** Zero / one / negative / maximum values; empty collections; degenerate geometry (identical start/end points, zero-length vectors, zero-area regions); extreme aspect ratios or size mismatches between related parameters; values exactly at a documented min/max boundary.
- **Integration / contract tests.** Boundaries between modules: message-passing contracts (e.g. worker/main-thread protocols), a function's output feeding another function's assumed invariant, shared config read differently by two consumers, error propagation across an async boundary.
- **Performance / combined worst case.** Existing perf tests often vary one dimension at a time (large size, or many items, tested separately). Combine the dimensions that are each individually "large" to find the actual worst case a user could hit.

## Calibrating rigor

- Deterministic, pure logic → exact assertions.
- Randomness, timing, floating point → statistical or tolerance-based assertions (fraction of runs, value within epsilon), not exact equality.
- Genuinely subjective output (writing style, visual/aesthetic quality, tone) → don't force a metric; say plainly that this needs human judgment and rely on review instead of inventing a proxy assertion that doesn't actually measure what matters.
