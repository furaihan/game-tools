---
name: rigorous-testing
description: >-
  Use this skill whenever asked to review, debug, test, validate, or find bugs in code or an
  algorithm — especially anything involving randomness, recursion, statistics, geometry/physics,
  floating point, or "why does X happen" questions. Also use it whenever asked to write tests,
  check for edge cases, verify a fix actually works, or judge whether a suspected bug is real.
  Trigger even if the user doesn't say "test" explicitly — phrases like "review this", "does this
  look right", "why is my river/graph/simulation doing X", "check this for bugs", or pasting code
  with a vague complaint should all trigger it. The core idea is to not just read code and guess
  what's wrong, but to run it, instrument it, and back every claim with numbers from actual
  execution before reporting it as a finding.
---

# Rigorous Testing

Reading code and guessing what's wrong is fast but unreliable — plausible-sounding explanations are often wrong, especially for anything involving randomness, recursion, or compounding effects across many steps. This skill is about the difference between "I think this causes X" and "I ran it 30 times and 26 of them showed X, here's why." The second one is what makes a review actually useful instead of just confident-sounding.

This skill has two halves:
1. **Empirical bug verification** — the investigative loop for confirming a suspected bug is real, understanding its root cause, and reporting it well.
2. **Test design** — deciding what to actually test, beyond the specific bug someone already flagged.

Use both together. A user pointing at one symptom is a starting point, not the whole job — the same investigation technique that confirms their hypothesis usually surfaces two or three more issues nearby, and that's often the more valuable part of the review.

## Part 1: Empirical bug verification

### The loop

1. **Read the code and form a hypothesis.** Where in the code would the reported symptom originate? Get specific — not "the randomness is wrong" but "the recursive displacement's decay factor doesn't shrink fast enough relative to segment length, so relative amplitude grows with depth."

2. **Make the code runnable in isolation.** Real code usually can't be executed as-is outside its app — it imports app-internal modules, needs a DOM, needs a database connection, needs config that doesn't exist standalone. Don't let this stop you. Copy the relevant file(s) into a scratch directory, stub out the external dependencies with minimal fakes (a seeded PRNG is a few lines; a DB call can be a hardcoded return value), and get it to actually run. This is almost always worth the setup cost — five minutes of stubbing beats an hour of uncertain code-reading.

3. **Instrument, don't just execute.** Running the function once and glancing at the output rarely confirms anything. Add lightweight exports or a debug wrapper that returns the *internal quantities* relevant to the hypothesis — angles, ratios, counts, distances, which branch was taken — not just the final result. Keep this instrumentation separate from the production logic (e.g. a parallel `analyzeX()` export next to the real function) so you're not changing behavior while measuring it.

4. **Run across many seeds/inputs, not one.** A single run proves a hypothesis is *possible*, not that it's *the* cause or that it's *common*. Loop over 20-30 seeds (or the input space that matters — sizes, extreme parameter values, edge-of-range inputs) and aggregate: what fraction of runs show the symptom? What's the worst case? Is there a threshold (a parameter value, a size) where behavior changes qualitatively?

5. **Quantify before you claim.** "Branches cluster on one side" is an impression. "26 of 30 seeds had every branch on the same side" is evidence. Always prefer the second form in what you report — it's checkable, it's specific, and it tells the reader how confident to be.

6. **Trace the mechanism, don't stop at correlation.** Once you've confirmed *that* something happens, explain *why*, in terms of the actual code (cite file and line). "Roughness above ~0.5 produces >90° turns" is an observation; "the decay factor is 0.55 but should be ≤0.5, so relative displacement-to-segment-length grows as (2×decay)^depth instead of shrinking" is the mechanism. The mechanism is what makes the fix obvious instead of a guess.

7. **While you're already instrumented, check what's nearby for free.** You've already built a harness and a way to run many trials — this is the cheapest moment to check adjacent risk areas, not a separate task to schedule later. See the checklist in Part 2 for where these usually hide (magic numbers, hedge-word comments, silent fallbacks, boundary clamps). In the river-generator example this skill was extracted from, the same harness that confirmed the two reported bugs also surfaced two more (a branch-count fidelity failure and a thin-width erosion bug) in about ten extra minutes — because the infrastructure to check was already built.

8. **Visualize when the algorithm is spatial.** For anything geometric, spatial, or visual (paths, layouts, generated maps, UI structure), a quick low-res ASCII or coarse-grid rendering of the raw output is often more convincing — and faster to produce — than more statistics. Seeing the artifact directly can reveal things aggregate numbers miss.

### Reporting findings

Use the template and worked example in `references/report-template.md`: **Issue / Why / Impact / Fix**, each claim backed by a number from an actual run, each explanation pointing at a specific file and line. Order findings by impact, not by the order you found them. If you found more issues than the user asked about, say so explicitly rather than burying them — "here's what you asked about, and here's what else I found while I was in there."

Don't report a hypothesis as a finding until you've run something to confirm it. If you're out of time/budget to verify something, say "I suspect X but haven't confirmed it" rather than presenting it with the same confidence as a verified finding.

### A minimal stub pattern

Most "can't run this in isolation" problems are solved by the same trick: copy the file, replace the app-internal import with a local stub of matching shape, fix the import path, run it. Example for a seeded RNG dependency:

```ts
// prng-stub.ts — stands in for '@/app/internal/prng' just for testing
export function createPRNG(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

The exact algorithm doesn't need to match production — it just needs to be seeded and deterministic so runs are reproducible while you investigate. Swap in the real dependency (or write the test inside the real codebase's test framework) once you're past the investigation phase and writing the actual regression test.

## Part 2: Deciding what to test

A bug report gives you one test. A good review gives the codebase several. After confirming the reported issue(s), think in these categories — `references/testing-checklist.md` has the full checklist with more detail and a systematic "where bugs hide" list (magic numbers, hedge-word comments, silent fallbacks, etc.) to scan for during Part 1 step 7:

- **Regression tests** — lock in the fix for what you just found, in a form that fails if the bug comes back. For probabilistic bugs this usually means a statistical assertion ("<30% of seeds show the biased pattern"), not a single-input assertion.
- **Statistical / property tests** — for anything with randomness, generative logic, or an invariant that should hold across all inputs (determinism given a seed, output always within bounds, counts conserved), assert the property across many generated inputs rather than one hand-picked example.
- **Edge cases** — zero, one, negative, maximum, just-past-a-hardcoded-cap, empty collections, degenerate geometry (start==end, zero-length vectors), extreme aspect ratios. Existing test suites often cover the "doesn't crash" version of these but not the "produces sane output" version — check for that gap specifically.
- **Integration / contract tests** — do the pieces actually agree at their boundaries? A worker's message contract, a function whose output feeds another function's assumed invariant, a config value that two different modules both read but might interpret differently.
- **Performance / worst-case combination tests** — existing tests often stress one dimension at a time (large size *or* many items), not the combination (large size *and* many items *and* an edge-case parameter together), which is where real worst cases live.

Match rigor to what's actually being tested: deterministic logic gets exact assertions; anything involving randomness, timing, or floating point gets statistical or tolerance-based assertions; genuinely subjective output (writing style, visual taste) doesn't get an assertion at all — say so and rely on human review instead of forcing a metric onto it.

## When writing the actual tests

Write tests in the project's existing test framework and conventions, once you're past the exploratory scratch-directory phase — don't leave real regression tests living only in a throwaway harness. Name tests for what they verify, not for the bug ticket ("branch exit points are distributed on both sides of the flow direction", not "fix for issue reported by user"). If the project doesn't have a test suite yet, ask before creating the scaffolding for one — that's a bigger decision than adding one file.
