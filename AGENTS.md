<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `bunx --no-install --package @tanstack/intent intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `bunx --no-install --package @tanstack/intent intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

<!-- ui-verification:start -->
## Verifying UI changes

Before claiming a UI change works, verify it in a real browser. A Playwright MCP server is
configured in `.pi/mcp.json` (project scope, pi only):

```bash
bun run dev        # the server is locked to http://localhost:5173
pi mcp list        # expect: playwright: connected, N tools (direct, project)
```

Rules that will otherwise waste your time: the dev server is IPv6-only (`localhost`, never
`127.0.0.1`); use `--browser msedge` because Chrome is not installed here; cold route loads take 2-7s
so `browser_navigate`'s settle is never a readiness signal (`waitForSelector` on a testid); canvases
are invisible to accessibility snapshots, so assert rendered output by hashing `getImageData()`; wait
for the generate button to become enabled with a `Regenerate` label instead of searching page text for
"Generating"; and prefer one `browser_run_code_unsafe` call (real `page.waitForSelector` / `page.fill`
/ `page.click`) over chains of `browser_evaluate`. Screenshots and traces go to the git-ignored
`.playwright-mcp/`.

Every interactive control carries a `data-testid` — add one (`<tool>-<control>`) for any control you
introduce. See `.agents/skills/game-tools/SKILL.md` → "Verifying UI with Playwright MCP" for the full
testid table and a copy-paste determinism recipe.
<!-- ui-verification:end -->
