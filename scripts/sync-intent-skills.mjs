import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const srcBase = 'node_modules'
const dstBase = '.agents/skills'

function isSkillRoot(dir) {
  return statSync(dir).isDirectory() && existsSync(join(dir, 'SKILL.md'))
}

function findSkillRoots() {
  const roots = []
  let topLevels
  try {
    topLevels = readdirSync(srcBase)
  } catch {
    return roots
  }

  for (const entry of topLevels) {
    const pkgDir = join(srcBase, entry)
    if (!statSync(pkgDir).isDirectory()) continue

    if (entry.startsWith('@')) {
      let scoped
      try {
        scoped = readdirSync(pkgDir)
      } catch {
        continue
      }
      for (const name of scoped) {
        const skillsDir = join(pkgDir, name, 'skills')
        if (!existsSync(skillsDir)) continue
        try {
          for (const skill of readdirSync(skillsDir)) {
            const sr = join(skillsDir, skill)
            if (isSkillRoot(sr)) roots.push(sr)
          }
        } catch {
          /* skip */
        }
      }
    } else {
      const skillsDir = join(pkgDir, 'skills')
      if (!existsSync(skillsDir)) continue
      try {
        for (const skill of readdirSync(skillsDir)) {
          const sr = join(skillsDir, skill)
          if (isSkillRoot(sr)) roots.push(sr)
        }
      } catch {
        /* skip */
      }
    }
  }

  return roots
}

if (!existsSync(dstBase)) mkdirSync(dstBase, { recursive: true })

const roots = findSkillRoots()
for (const src of roots) {
  const normalized = src.replace(/\\/g, '/')
  const match = normalized.match(/\/skills\/(.+)$/)
  if (!match) continue
  const relPath = match[1]
  const dest = join(dstBase, relPath)

  if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true, force: true })
  console.log(`  ✓ ${relPath}`)
}

console.log(`\nMirrored ${roots.length} skill directories to ${dstBase}/`)
