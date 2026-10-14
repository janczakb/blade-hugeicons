import { readFile, writeFile, mkdir, readdir, rm, rename, copyFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { iconName, renderSvg } from './svg.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const upstream = resolve(root, 'node_modules/@hugeicons/core-free-icons')
const metadata = JSON.parse(await readFile(resolve(upstream, 'package.json'), 'utf8'))
const lock = JSON.parse(await readFile(resolve(root, 'package-lock.json'), 'utf8'))
const pinned = lock.packages['node_modules/@hugeicons/core-free-icons']
if (metadata.version !== pinned.version || !pinned.integrity) throw Error('Upstream release does not match the lockfile')
const stage = resolve(root, 'resources/svg.pending')
await rm(stage, {recursive:true,force:true}); await mkdir(stage, {recursive:true})
const names = new Set(), manifest = {}, digest = createHash('sha256')
try {
    const files = (await readdir(resolve(upstream, 'dist/esm'))).filter(name => name.endsWith('Icon.js')).sort()
    for (const file of files) {
        const exported = file.slice(0, -3), name = iconName(exported)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || names.has(name)) throw Error(`Invalid or duplicate icon: ${name}`)
        names.add(name)
        const data = (await import(pathToFileURL(resolve(upstream, 'dist/esm', file)))).default
        const svg = renderSvg(data)
        await writeFile(resolve(stage, `${name}.svg`), svg)
        manifest[exported] = `hugeicons-${name}`
        digest.update(name + '\0' + svg)
    }
    if (names.size < 6000) throw Error('Incomplete upstream catalog')
    await rm(resolve(root, 'resources/svg'), {recursive:true,force:true})
    await rename(stage, resolve(root, 'resources/svg'))
    await copyFile(resolve(upstream, 'LICENSE.md'), resolve(root, 'LICENSE-HUGEICONS.md'))
    await writeFile(resolve(root, 'resources/manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
    await writeFile(resolve(root, 'resources/upstream.json'), JSON.stringify({package:metadata.name,version:metadata.version,integrity:pinned.integrity,license:metadata.license,style:'Stroke Rounded',icons:names.size,catalogSha256:digest.digest('hex')}, null, 2) + '\n')
    console.log(`Generated ${names.size} SVG icons from ${metadata.name}@${metadata.version}`)
} catch (error) { await rm(stage, {recursive:true,force:true}); throw error }
