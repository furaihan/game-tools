# Finding report template

Use this structure per issue. Keep the four fields distinct — don't blend "why" and "impact" into one paragraph, they answer different questions (why does this happen vs. why does it matter).

```markdown
## Issue N: <short, specific title — not "bug in function X">

**Issue:** <what's observably wrong, in one or two sentences. Concrete, not vague ("branches
exit consistently on one side of the river" not "branch placement seems off").>

**Why it happens:** <the mechanism, in terms of the actual code. Name the file and line.
Explain the causal chain, not just where the symptom shows up.>

**Impact:** <what a user of the system actually experiences or loses because of this. Quantify
if you can (frequency, magnitude, which inputs trigger it).>

**Fix:** <a concrete, actionable change. Prefer the smallest change that addresses the
mechanism (from "Why") rather than papering over the symptom. Include a code snippet if it
clarifies the shape of the fix — but if the user has said they prefer to implement things
themselves, keep it to a snippet/pointer rather than a full rewrite.>
```

## Worked example

This is a real finding from a review of a procedural river-generation algorithm, included here as a calibration example for tone, specificity, and evidence density.

---

**Issue: Branches cluster on one side of the river**

**Issue:** Across 30 seeded runs with 5-6 branches each, 26/30 (87%) had *every* branch land on the same side of the main stem's local flow direction — real river networks have tributaries on both banks.

**Why it happens:** `findNearestValidEdgePoint` (river-generator.ts:120-164) excludes edge cells "ahead" of the flow direction (dot < 0.5, L148-155) and then picks the nearest remaining one (L157-160) — no left/right steering. The real root cause is upstream: `midpointDisplaceRecursive`'s first subdivision (a single random draw) sets a large-scale bow for the whole centerline that later, smaller-amplitude splits can't undo, so the centerline sits mostly on one side of the straight source→target line. "Nearest edge" from a lopsided centerline is consistently the same edge.

**Impact:** With branchCount up to 12 (per the UI), users can get up to 12 tributaries all exiting from the same bank — reads as visibly artificial rather than naturalistic.

**Fix:** Don't try to symmetrize the meander math (a natural bow is fine). Fix branch-side selection directly: compute `cross = dirX*(cell.y-fromY) - dirY*(cell.x-fromX)`, alternate the desired sign per branch index (or weight it 50/50 at random), filter candidates to that side first, and only fall back to "nearest regardless of side" if that side has no valid candidates.

---

Notice what makes this a *finding* rather than a guess: the percentage (26/30, not "often"), the specific file:line citations, a causal chain that traces back past the obvious location to the actual root cause, and a fix that's justified by the mechanism rather than just patching the symptom.
