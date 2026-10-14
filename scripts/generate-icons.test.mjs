import { test } from 'node:test'
import assert from 'node:assert/strict'
import { iconName, renderSvg } from './svg.mjs'

test('normalizes official names without losing numbered and acronym segments', () => {
    assert.equal(iconName('Linkedin02Icon'), 'linkedin-02')
    assert.equal(iconName('ArrowDownAZIcon'), 'arrow-down-az')
    assert.equal(iconName('UnfoldMoreIcon'), 'unfold-more')
    assert.equal(iconName('Calendar05Icon'), 'calendar-05')
    assert.equal(iconName('Grid2x2Icon'), 'grid-2x2')
})
test('preserves geometry, escapes attributes and inherits configurable stroke width', () => {
    const svg = renderSvg([['path',{d:'M1 2L3 4',strokeWidth:'1.5',strokeLinecap:'round',key:'0'}]])
    assert.match(svg, /d="M1 2L3 4" stroke-linecap="round"/)
    assert.equal((svg.match(/stroke-width=/g) ?? []).length, 1)
    assert.doesNotMatch(svg, /key=/)
    assert.match(renderSvg([['path',{d:'"<&'}]]), /&quot;&lt;&amp;/)
})
test('rejects active SVG content and unexpected upstream shape changes', () => {
    for (const data of [[['script',{}]],[['path',{onclick:'alert(1)'}]],[['path',{fill:'url(https://example.test/a)'}]],[]]) {
        assert.throws(() => renderSvg(data), TypeError)
    }
})


test('filled-only details do not acquire an unintended inherited stroke', () => {
    const svg = renderSvg([['circle',{cx:12,cy:12,r:1,fill:'currentColor'}]])
    assert.doesNotMatch(svg, / stroke=/)
    assert.match(svg, /fill="currentColor"/)
})
test('secondary paths precede opaque detail just as the official renderer does', () => {
    const svg = renderSvg([['path',{d:'foreground'}],['path',{d:'background',opacity:0.4}]])
    assert.ok(svg.indexOf('background') < svg.indexOf('foreground'))
})
