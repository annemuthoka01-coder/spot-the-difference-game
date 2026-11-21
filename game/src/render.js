/**
 * render.js turns a scene into the two picture elements the player compares,
 * and draws the rings that mark the differences already found.
 */
import { circle } from './paint.js';

function markerRing(diff) {
  return `<g class="marker">` +
    circle(diff.x, diff.y, diff.r, 'rgba(255,59,48,0.13)', ' stroke="#ff3b30" stroke-width="3.5"') +
    circle(diff.x, diff.y, 3.2, '#ff3b30') +
    `</g>`;
}

function hintRing(diff) {
  return `<g class="hint-ring">` +
    circle(diff.x, diff.y, diff.r + 5, 'none', ' stroke="#ffb703" stroke-width="4"') +
    `</g>`;
}

export function sceneSvg(scene, changed, foundIds = [], hintId = null) {
  const edits = changed ? new Set(scene.diffs.map((d) => d.id)) : new Set();
  let svg = `<svg viewBox="0 0 400 300" role="img" aria-label="${scene.title} picture">` + scene.art(edits);
  for (const diff of scene.diffs) {
    if (foundIds.includes(diff.id)) {
      svg += markerRing(diff);
    }
  }
  if (hintId !== null) {
    const hintDiff = scene.diffs.find((d) => d.id === hintId);
    if (hintDiff) {
      svg += hintRing(hintDiff);
    }
  }
  svg += `</svg>`;
  return svg;
}
