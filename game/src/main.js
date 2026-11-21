// main.js wires the page together — it builds the level cards, owns the two screens, and starts a Game for the chosen level; it also reads the URL parameters the screenshot states use (level, found, t, win, relaxed, shot).

import { SCENES } from './scenes.js';
import { sceneSvg } from './render.js';
import { Game } from './game.js';

const el = (id) => document.getElementById(id);

const menuScreen = el('menu-screen');
const gameScreen = el('game-screen');
const levelCards = el('level-cards');
const relaxedBox = el('relaxed');
const againBtn = el('again-btn');
const nextBtn = el('next-btn');
const menuBtn = el('menu-btn');
const bannerMenuBtn = el('banner-menu-btn');

const ui = {
  levelName: el('level-name'),
  foundCount: el('found-count'),
  remainCount: el('remain-count'),
  timer: el('timer'),
  score: el('score'),
  hintBtn: el('hint-btn'),
  soundBtn: el('sound-btn'),
  message: el('message'),
  panelOriginal: el('panel-original'),
  panelChanged: el('panel-changed'),
  banner: el('end-banner'),
  endTitle: el('end-title'),
  endText: el('end-text')
};

const game = new Game(ui, {});

SCENES.forEach((scene, index) => {
  const card = document.createElement('div');
  card.className = 'card';

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.innerHTML = sceneSvg(scene, false);

  const h3 = document.createElement('h3');
  h3.textContent = scene.title;

  const p = document.createElement('p');
  p.textContent = `${scene.blurb} ${scene.diffs.length} differences · ${scene.seconds} seconds.`;

  const btn = document.createElement('button');
  btn.textContent = 'Play';
  btn.addEventListener('click', () => startLevel(index));

  card.appendChild(preview);
  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(btn);
  levelCards.appendChild(card);
});

let current = -1;
let currentOpts = { relaxed: false };

function startLevel(index, opts = {}) {
  current = index;
  const relaxed = opts.relaxed ?? relaxedBox.checked;
  currentOpts = { relaxed };
  menuScreen.hidden = true;
  gameScreen.hidden = false;
  nextBtn.hidden = index >= SCENES.length - 1;
  game.start(SCENES[index], {
    relaxed,
    presetFound: opts.presetFound ?? [],
    presetTime: opts.presetTime ?? null,
    holdTimer: opts.holdTimer ?? false
  });
  window.scrollTo(0, 0);
}

function showMenu() {
  game.stop();
  gameScreen.hidden = true;
  menuScreen.hidden = false;
}

menuBtn.addEventListener('click', showMenu);
bannerMenuBtn.addEventListener('click', showMenu);
againBtn.addEventListener('click', () => startLevel(current, { relaxed: currentOpts.relaxed }));
nextBtn.addEventListener('click', () => startLevel(current + 1, { relaxed: currentOpts.relaxed }));

const q = new URLSearchParams(location.search);
if (q.get('relaxed') === '1') {
  relaxedBox.checked = true;
}
const levelId = q.get('level');
if (levelId) {
  const index = SCENES.findIndex((s) => s.id === levelId);
  if (index >= 0) {
    let presetFound = (q.get('found') || '').split(',').filter(Boolean);
    if (q.get('win') === '1') {
      presetFound = SCENES[index].diffs.map((d) => d.id);
    }
    startLevel(index, {
      relaxed: q.get('relaxed') === '1',
      presetFound,
      presetTime: q.has('t') ? Number(q.get('t')) : null,
      holdTimer: q.has('shot')
    });
  }
}
