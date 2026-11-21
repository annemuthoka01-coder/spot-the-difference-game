// These helpers build SVG scenes as strings so the whole game needs no image files.

export const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra}/>`;

export const ellipse = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${extra}/>`;

export const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;

export const line = (x1, y1, x2, y2, stroke, width, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"${extra}/>`;

export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;

export const polygon = (points, fill, extra = '') => `<polygon points="${points}" fill="${fill}"${extra}/>`;

export const join = (parts) => parts.join('');
