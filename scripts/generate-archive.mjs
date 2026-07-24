import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'
import sharp from '/Users/zhuzi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js'

const root = '/Users/zhuzi/Documents/作品集网站设计'
const sourceRoot = join(root, '作品集整理')
const outputRoot = join(root, 'public/assets/archive')
const tempRoot = join(root, 'tmp/archive-previews')
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const documentExtensions = new Set(['.pdf', '.pptx'])
const categoryOrder = ['包装', '画册', '详情页', '网站', '展会', '活动', '宣传dm', 'logo', 'ppt']

rmSync(outputRoot, { recursive: true, force: true })
rmSync(tempRoot, { recursive: true, force: true })
mkdirSync(outputRoot, { recursive: true })
mkdirSync(tempRoot, { recursive: true })

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function cleanName(filePath) {
  return basename(filePath, extname(filePath))
    .replace(/封面$/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
}

function comparableName(filePath) {
  return cleanName(filePath).replace(/\s+/gu, '').toLowerCase()
}

function matchingCover(documentPath, files) {
  const target = comparableName(documentPath)
  return files.find(filePath => {
    if (!imageExtensions.has(extname(filePath).toLowerCase())) return false
    const candidate = comparableName(filePath)
    return candidate === target || candidate.startsWith(target) || target.startsWith(candidate)
  })
}

function renderDocument(filePath, id) {
  const extension = extname(filePath).toLowerCase()
  let pdfPath = filePath
  if (extension === '.pptx') {
    const slideDirectory = join(tempRoot, `slides-${id}`)
    mkdirSync(slideDirectory, { recursive: true })
    execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', slideDirectory, filePath], { stdio: 'ignore' })
    const converted = readdirSync(slideDirectory).find(name => extname(name).toLowerCase() === '.pdf')
    if (!converted) throw new Error(`Unable to render ${filePath}`)
    pdfPath = join(slideDirectory, converted)
  }
  const prefix = join(tempRoot, `document-${id}`)
  execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-jpeg', '-jpegopt', 'quality=82', '-r', '120', pdfPath, prefix], { stdio: 'ignore' })
  return `${prefix}.jpg`
}

const allFiles = walk(sourceRoot).filter(filePath => {
  const extension = extname(filePath).toLowerCase()
  return imageExtensions.has(extension) || documentExtensions.has(extension)
})

const works = []
let itemIndex = 0

for (const category of categoryOrder) {
  const categoryFiles = allFiles.filter(filePath => relative(sourceRoot, filePath).split('/')[0] === category)
  const documents = categoryFiles.filter(filePath => documentExtensions.has(extname(filePath).toLowerCase()))
  const standaloneImages = categoryFiles.filter(filePath => {
    if (!imageExtensions.has(extname(filePath).toLowerCase())) return false
    if (!basename(filePath, extname(filePath)).includes('封面')) return true
    return !documents.some(documentPath => matchingCover(documentPath, [filePath]))
  })
  const logicalFiles = [...documents, ...standaloneImages]

  for (const filePath of logicalFiles) {
    itemIndex += 1
    const id = String(itemIndex).padStart(3, '0')
    const extension = extname(filePath).toLowerCase()
    const cover = documentExtensions.has(extension) ? matchingCover(filePath, categoryFiles) : null
    const previewSource = cover || (documentExtensions.has(extension) ? renderDocument(filePath, id) : filePath)
    const outputName = `${id}.webp`
    await sharp(previewSource)
      .rotate()
      .resize({ width: 1600, height: 5000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(join(outputRoot, outputName))

    works.push({
      id,
      title: cleanName(filePath),
      category,
      type: extension === '.pdf' ? 'PDF' : extension === '.pptx' ? 'PPT' : 'IMAGE',
      image: `assets/archive/${outputName}`,
      group: relative(join(sourceRoot, category), dirname(filePath)).replaceAll('/', ' / '),
    })
  }
}

writeFileSync(join(root, 'src/archive.generated.json'), `${JSON.stringify(works, null, 2)}\n`)
console.log(`Generated ${works.length} web portfolio previews.`)
