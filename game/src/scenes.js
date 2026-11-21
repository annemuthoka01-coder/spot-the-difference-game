// Scenes are painted twice from one description — paint(editSet) draws the scene with the named edits applied;
// the Original uses an empty set, the Changed uses every difference id; each scene also lists its differences
// as hit circles { id, x, y, r } in the 400x300 picture space.

import { circle, ellipse, rect, line, path, polygon, join } from './paint.js';

const cloud = (x, y, s) => join([
  ellipse(x, y, 24 * s, 14 * s, '#ffffff', ' opacity="0.9"'),
  ellipse(x - 14 * s, y + 4 * s, 16 * s, 11 * s, '#ffffff', ' opacity="0.9"'),
  ellipse(x + 14 * s, y + 3 * s, 18 * s, 12 * s, '#ffffff', ' opacity="0.9"')
]);

const bird = (x, y) => path(
  `M ${x} ${y} q 5 -6 10 0 q 5 -6 10 0`,
  'none',
  ' stroke="#34506b" stroke-width="2.4" fill="none"'
);

const flower = (x, y, colour) => join([
  line(x, y + 4, x, y + 12, '#2f7d32', 2),
  circle(x, y, 5, colour),
  circle(x, y, 1.8, '#fff3b0')
]);

const sunRays = (cx, cy, r) => {
  const parts = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x1 = cx + (r + 6) * Math.cos(angle);
    const y1 = cy + (r + 6) * Math.sin(angle);
    const x2 = cx + (r + 16) * Math.cos(angle);
    const y2 = cy + (r + 16) * Math.sin(angle);
    parts.push(line(x1, y1, x2, y2, '#ffb703', 4, ' stroke-linecap="round"'));
  }
  return join(parts);
};

const parkArt = (edits) => join([
  rect(0, 0, 400, 212, '#aee3f5'),
  sunRays(52, 48, 26),
  circle(52, 48, 26, '#ffd94d'),
  cloud(128, 42, 1),
  cloud(292, 30, 0.8),
  bird(206, 42),
  bird(238, 60),
  edits.has('bird') ? '' : bird(316, 48),
  path('M0 176 Q 100 138 200 168 T 400 162 V 212 H 0 Z', '#97d695'),
  rect(0, 204, 400, 96, '#79c25f'),
  polygon('172,300 214,300 204,216 190,216', '#e8d8a8'),
  rect(38, 152, 10, 58, '#8a5a33'),
  circle(43, 132, 24, '#4caf50'),
  circle(24, 147, 17, '#4caf50'),
  circle(62, 147, 17, '#4caf50'),
  rect(318, 122, 14, 88, '#8a5a33'),
  circle(325, 96, 38, '#3e9b4f'),
  circle(294, 116, 26, '#3e9b4f'),
  circle(356, 116, 26, '#3e9b4f'),
  circle(304, 88, 5, '#e63946'),
  circle(341, 80, 5, '#e63946'),
  circle(353, 104, 5, '#e63946'),
  edits.has('apple') ? '' : circle(322, 120, 5, '#e63946'),
  path('M110 78 q 5 14 -2 27', 'none', ' stroke="#555" stroke-width="2" fill="none"'),
  polygon('110,38 127,58 110,78 93,58', edits.has('kite') ? '#2ec4b6' : '#ff8c42'),
  line(93, 58, 127, 58, '#ffffff', 1.4, ' opacity="0.6"'),
  line(110, 38, 110, 78, '#ffffff', 1.4, ' opacity="0.6"'),
  line(110, 105, 86, 168, '#555', 1.2),
  rect(172, 206, 6, 48, '#6b4423'),
  rect(222, 206, 6, 48, '#6b4423'),
  rect(168, 208, 64, 6, '#a9713a'),
  edits.has('slat') ? '' : rect(168, 217, 64, 6, '#a9713a'),
  rect(168, 226, 64, 6, '#a9713a'),
  rect(168, 240, 64, 7, '#a9713a'),
  ellipse(70, 274, 54, 13, '#7a4a21'),
  flower(38, 262, '#e63946'),
  flower(88, 262, '#ffd94d'),
  flower(52, 269, '#ff8fab'),
  flower(80, 269, '#ffffff'),
  flower(64, 257, edits.has('flower') ? '#9b5de5' : '#e63946'),
  ellipse(140, 284, 27, 12, '#57a773'),
  ellipse(300, 286, 31, 13, '#57a773'),
  ellipse(372, 280, 22, 11, '#57a773')
]);

export const parkScene = {
  id: 'park',
  title: 'Sunny park',
  seconds: 90,
  blurb: 'A kite, a bench and five quiet edits.',
  diffs: [
    { id: 'bird', x: 324, y: 50, r: 17 },
    { id: 'flower', x: 64, y: 257, r: 12 },
    { id: 'apple', x: 322, y: 120, r: 12 },
    { id: 'kite', x: 110, y: 58, r: 21 },
    { id: 'slat', x: 200, y: 220, r: 15 }
  ],
  art: parkArt
};




// Helper: fish
function fish(x, y, s, colour) {
  return join([
    ellipse(x, y, 11 * s, 6 * s, colour),
    polygon(`${x - 16 * s},${y} ${x - 8 * s},${y - 6 * s} ${x - 8 * s},${y + 6 * s}`, colour),
    circle(x + 5 * s, y - 1, 1.6 * s, '#ffffff')
  ]);
}

// Helper: bubble
function bubble(x, y, r) {
  return circle(x, y, r, 'rgba(255,255,255,0.30)', ' stroke="#cfeeff" stroke-width="1.2"');
}


function seaArt(edits) {
  return join([
    rect(0, 0, 400, 300, '#1b6ca8'),
    rect(0, 0, 400, 110, '#2a86c5'),
    polygon('60,0 96,0 66,190 30,190', '#ffffff', ' opacity="0.07"'),
    polygon('210,0 232,0 226,170 198,170', '#ffffff', ' opacity="0.06"'),
    fish(56, 120, 0.8, '#0f4c81'),
    fish(330, 150, 0.9, '#0f4c81'),
    fish(96, 176, 0.7, '#0f4c81'),
    path('M0 262 Q 120 246 220 260 T 400 254 V 300 H 0 Z', '#e9d8a6'),
    path('M18 300 q -8 -34 0 -62 q 8 -26 2 -44', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M36 300 q -8 -34 0 -62 q 8 -26 2 -44', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M54 300 q -8 -22 0 -42 q 8 -16 2 -30', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M348 300 q -8 -34 0 -62 q 8 -26 2 -44', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M366 300 q -8 -34 0 -62 q 8 -26 2 -44', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M384 300 q -8 -34 0 -62 q 8 -26 2 -44', 'none', ' stroke="#2e9e5b" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M44 262 q -4 -26 -16 -38 M44 262 q 0 -30 4 -46 M44 262 q 6 -24 20 -34', 'none', ' stroke="#ff7f6b" stroke-width="6" fill="none" stroke-linecap="round"'),
    circle(28, 222, 5, '#ff9e8a'),
    circle(48, 214, 5, '#ff9e8a'),
    circle(64, 226, 5, '#ff9e8a'),
    ellipse(58, 268, 20, 9, '#f368e0'),
    fish(100, 78, 1, '#ffb703'),
    fish(138, 62, 1, '#ff8c42'),
    fish(138, 96, 1, '#ffb703'),
    fish(176, 80, 1, '#ff8c42'),
    ...(edits.has('fish') ? [] : [fish(252, 64, 1, '#ffd94d')])

    ,
    ellipse(322, 44, 25, 15, '#66bb6a'),
    circle(350, 44, 8, '#81c784'),
    ellipse(306, 34, 8, 4, '#81c784'),
    ellipse(308, 56, 8, 4, '#81c784'),
    path('M306 38 q 16 -10 32 0', 'none', ' stroke="#388e3c" stroke-width="2" fill="none"'),
    path('M190 228 q -4 14 2 24', 'none', ' stroke="#7c4dbd" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M202 228 q -4 14 2 24', 'none', ' stroke="#7c4dbd" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M216 228 q -4 14 2 24', 'none', ' stroke="#7c4dbd" stroke-width="7" fill="none" stroke-linecap="round"'),
    path('M228 228 q -4 14 2 24', 'none', ' stroke="#7c4dbd" stroke-width="7" fill="none" stroke-linecap="round"'),
    ellipse(211, 206, 27, 23, '#9b5de5'),
    circle(202, 202, 5.5, '#ffffff'),
    circle(220, 202, 5.5, '#ffffff'),
    circle(202, 203, 2.6, '#263238'),
    circle(220, 203, 2.6, '#263238'),
    circle(196, 192, 4, '#c77dff'),
    circle(226, 194, 4, '#c77dff'),
    ...(edits.has('spot') ? [] : [circle(211, 216, 5, '#c77dff')]),
    rect(292, 234, 62, 32, '#8a5a33'),
    path('M292 234 a 31 16 0 0 1 62 0 Z', '#a9713a'),
    rect(318, 220, 10, 46, '#d4a017'),
    circle(323, 240, 6, '#ffd94d'),
    circle(300, 272, 6, '#ffd94d', ' stroke="#d4a017" stroke-width="1.6"'),
    circle(316, 277, 6, '#ffd94d', ' stroke="#d4a017" stroke-width="1.6"'),
    ...(edits.has('coin') ? [] : [circle(338, 270, 6, '#ffd94d', ' stroke="#d4a017" stroke-width="1.6"')]),
    polygon('86,243 91,253 101,253 93,259 96,269 86,263 76,269 79,259 71,253 81,253', edits.has('starfish') ? '#f368e0' : '#ff9f43'),
    circle(86, 257, 3, '#ffffff', ' opacity="0.5"'),
    bubble(296, 152, 6),
    bubble(307, 130, 4),
    bubble(180, 150, 5),
    bubble(172, 128, 3.4),
    ...(edits.has('bubble') ? [] : [bubble(300, 104, 7)])
  ]);
}


export const seaScene = {
  id: 'sea',
  title: 'Under the sea',
  seconds: 90,
  blurb: 'Fish, an octopus and a chest of coins.',
  diffs: [
    { id: 'fish', x: 252, y: 64, r: 15 },
    { id: 'starfish', x: 86, y: 258, r: 15 },
    { id: 'bubble', x: 300, y: 104, r: 12 },
    { id: 'spot', x: 211, y: 216, r: 12 },
    { id: 'coin', x: 338, y: 270, r: 12 }
  ],
  art: seaArt
};

const tuft = (x, y, colour) => join([
  line(x, y, x - 6, y - 14, colour, 2.6, ' stroke-linecap="round"'),
  line(x, y, x, y - 17, colour, 2.6, ' stroke-linecap="round"'),
  line(x, y, x + 6, y - 14, colour, 2.6, ' stroke-linecap="round"')
]);

export function savannaArt(edits) {
  return join([
    rect(0, 0, 400, 92, '#ff8c5a'),
    rect(0, 92, 400, 74, '#ffa96b'),
    rect(0, 166, 400, 30, '#e0aa5e'),
    rect(0, 196, 400, 104, '#c98f4e'),
    circle(140, 98, 40, '#ffe08a', ' stroke="#ffb703" stroke-width="3"'),
    ...(edits.has('sunband') ? [] : [rect(97, 89, 86, 10, '#ff9e5e', ' rx="5" opacity="0.92"')]),
    path('M196 38 q 5 -6 10 0 q 5 -6 10 0', 'none', ' stroke="#7a4a21" stroke-width="2.2" fill="none"'),
    path('M230 54 q 4 -5 8 0 q 4 -5 8 0', 'none', ' stroke="#7a4a21" stroke-width="2" fill="none"'),
    path('M318 252 q -2 -52 -12 -84 M318 252 q 4 -48 22 -78 M318 252 q 0 -30 -2 -58', 'none', ' stroke="#6b4423" stroke-width="7" fill="none" stroke-linecap="round"'),
    ellipse(316, 82, 66, 13, '#5d8a3c'),
    ellipse(282, 74, 40, 10, '#679644'),
    ellipse(352, 76, 38, 10, '#679644'),
    ...(edits.has('branchbird') ? [] : [ellipse(296, 95, 7, 5, '#263238'), circle(302, 90, 3.4, '#263238'), polygon('290,97 284,101 291,101', '#263238')]),
    rect(60, 184, 7, 46, '#f2b544'),
    rect(74, 184, 7, 46, '#f2b544'),
    rect(96, 184, 7, 46, '#f2b544'),
    rect(108, 184, 7, 46, '#f2b544'),
    rect(60, 226, 7, 5, '#6b4423'),
    rect(74, 226, 7, 5, '#6b4423'),
    rect(96, 226, 7, 5, '#6b4423'),
    rect(108, 226, 7, 5, '#6b4423'),
    ellipse(87, 166, 35, 22, '#f2b544'),
    polygon('50,152 64,82 80,86 74,154', '#f2b544'),
    ellipse(64, 78, 13, 9, '#f2b544'),
    line(58, 70, 56, 60, '#b5651d', 3),
    line(68, 69, 68, 59, '#b5651d', 3),
    circle(56, 59, 2.4, '#b5651d'),
    circle(68, 58, 2.4, '#b5651d'),
    ellipse(76, 74, 5, 3, '#e09f3e'),
    circle(60, 76, 1.8, '#263238'),
    circle(76, 158, 6, '#b5651d'),
    circle(99, 170, 5, '#b5651d'),
    circle(64, 176, 5, '#b5651d'),
    polygon('88,150 96,154 90,160 84,155', '#b5651d'),
    circle(58, 132, 4, '#b5651d'),
    circle(70, 100, 3.6, '#b5651d'),
    ...(edits.has('giraffespot') ? [] : [circle(66, 117, 5, '#b5651d')]),
    line(120, 152, 126, 178, '#b5651d', 3),
    rect(166, 206, 11, 32, '#9aa5b1'),
    rect(184, 206, 11, 32, '#9aa5b1'),
    rect(204, 206, 11, 32, '#9aa5b1'),
    rect(220, 206, 11, 32, '#9aa5b1'),
    ellipse(196, 188, 41, 26, '#9aa5b1'),
    circle(233, 180, 20, '#9aa5b1'),
    ellipse(224, 176, 11, 14, '#868f99'),
    path('M248 190 q 12 16 6 34 q -2 8 -9 8', 'none', ' stroke="#9aa5b1" stroke-width="9" fill="none" stroke-linecap="round"'),
    circle(238, 176, 2, '#263238'),
    ...(edits.has('tusk') ? [] : [polygon('236,194 250,199 238,207', '#fff8e7')]),
    line(156, 176, 150, 200, '#868f99', 3),
    rect(306, 226, 6, 24, '#f5f5f5'),
    rect(318, 226, 6, 24, '#f5f5f5'),
    rect(340, 226, 6, 24, '#f5f5f5'),
    rect(352, 226, 6, 24, '#f5f5f5'),
    rect(306, 246, 6, 4, '#263238'),
    rect(318, 246, 6, 4, '#263238'),
    rect(340, 246, 6, 4, '#263238'),
    rect(352, 246, 6, 4, '#263238'),
    ellipse(330, 212, 31, 18, '#f5f5f5'),
    polygon('352,200 372,176 384,182 366,208', '#f5f5f5'),
    polygon('370,174 392,180 390,190 372,188', '#f5f5f5'),
    circle(374, 172, 3, '#f5f5f5'),
    circle(384, 182, 1.8, '#263238'),
    rect(356, 176, 6, 24, '#263238', ' rx="3" transform="rotate(24 359 188)"'),
    line(314, 198, 312, 224, '#263238', 4),
    line(326, 195, 325, 228, '#263238', 4),
    line(344, 196, 346, 226, '#263238', 4),
    line(362, 186, 370, 198, '#263238', 3.4),
    ...(edits.has('zebrastripe') ? [] : [line(337, 197, 338, 227, '#263238', 4)]),
    line(300, 204, 294, 226, '#263238', 3),
    tuft(30, 274, '#7a8b3d'),
    tuft(128, 284, '#7a8b3d'),
    tuft(252, 278, '#7a8b3d'),
    tuft(372, 284, '#7a8b3d'),
    tuft(52, 268, edits.has('tuft') ? '#d9a441' : '#7a8b3d'),
    ellipse(180, 288, 14, 5, '#a97a3f'),
    ellipse(96, 292, 10, 4, '#a97a3f')
  ]);
}

export const savannaScene = {
  id: 'savanna',
  title: 'Savanna at sunset',
  seconds: 90,
  blurb: 'Six edits hide in the golden hour.',
  diffs: [
    { id: 'sunband', x: 140, y: 94, r: 21 },
    { id: 'branchbird', x: 297, y: 94, r: 13 },
    { id: 'giraffespot', x: 66, y: 117, r: 11 },
    { id: 'tusk', x: 242, y: 201, r: 12 },
    { id: 'zebrastripe', x: 338, y: 211, r: 13 },
    { id: 'tuft', x: 52, y: 264, r: 12 }
  ],
  art: savannaArt
};

export const SCENES = [parkScene, seaScene, savannaScene];
