const tags = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'clipPath'])
const attributes = new Set(['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'width', 'height', 'points', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'fillRule', 'clipRule', 'opacity', 'strokeOpacity', 'fillOpacity', 'transform', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'id', 'clipPath'])
export const iconName = name => name.replace(/Icon$/, '').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').replace(/([0-9])x-([0-9])/g, '$1x$2').toLowerCase()
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]))
export function renderSvg(data) {
    if (!Array.isArray(data) || !data.length) throw new TypeError('Invalid upstream icon data')
    const nodes = [...data].sort(([, a], [, b]) => Number(b.opacity !== undefined) - Number(a.opacity !== undefined)).map(([tag, props]) => {
        if (!tags.has(tag) || !props || typeof props !== 'object') throw new TypeError('Unsupported upstream SVG node')
        const pairs = Object.entries(props).flatMap(([key, value]) => {
            if (key === 'key' || (key === 'strokeWidth' && String(value) === '1.5')) return []
            if (!attributes.has(key) || !['string','number'].includes(typeof value) || /(?:javascript:|https?:|data:)/i.test(String(value))) throw new TypeError('Unsupported upstream SVG attribute')
            const name = key === 'clipPath' ? 'clip-path' : key.replace(/[A-Z]/g, char => '-' + char.toLowerCase())
            return [`${name}="${escape(value)}"`]
        })
        return `  <${tag} ${pairs.join(' ')}/>`
    })
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1.5">\n${nodes.join('\n')}\n</svg>\n`
}
