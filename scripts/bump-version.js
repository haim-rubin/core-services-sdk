import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const type = process.argv[2] // "major" | "minor" | "patch" | "-major" | "-minor" | "-patch"

if (!['major', 'minor', 'patch', '-major', '-minor', '-patch'].includes(type)) {
  console.error(`Usage: npm run bump <major|minor|patch|-major|-minor|-patch>`)
  process.exit(1)
}

const pkgPath = path.resolve(process.cwd(), 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

let [major, minor, patch] = pkg.version.split('.').map(Number)

const bump = () => {
  switch (type) {
    case 'major':
      return [major + 1, 0, 0]
    case 'minor':
      return [major, minor + 1, 0]
    case 'patch':
      return [major, minor, patch + 1]
    case '-major':
      if (major === 0) {
        throw new Error('Cannot decrement major below 0')
      }
      return [major - 1, 0, 0]
    case '-minor':
      if (minor === 0) {
        if (major === 0) {
          throw new Error('Cannot decrement minor below 0.0')
        }
        return [major - 1, 0, 0]
      }
      return [major, minor - 1, 0]
    case '-patch':
      if (patch === 0) {
        if (minor === 0) {
          if (major === 0) {
            throw new Error('Cannot decrement below 0.0.0')
          }
          return [major - 1, 0, 0]
        }
        return [major, minor - 1, 0]
      }
      return [major, minor, patch - 1]
  }
}

const [newMajor, newMinor, newPatch] = bump()
const newVersion = `${newMajor}.${newMinor}.${newPatch}`

pkg.version = newVersion
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`✔ Updated version to ${newVersion}`)

// update package-lock.json if exists
if (fs.existsSync('./package-lock.json')) {
  try {
    execSync('npm install --package-lock-only', { stdio: 'inherit' })
    console.log('✔ package-lock.json updated')
  } catch (err) {
    console.error('Failed to update package-lock.json', err)
  }
}
