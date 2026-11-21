# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annemuthoka01-coder/spot-the-difference-game/rank.svg)](https://make.fun/competitions/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annemuthoka01-coder/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game drawn entirely in code (SVG scenes, no image files, no network); two pictures side by side, tap the edits; three hunts — Sunny park, Under the sea, Savanna at sunset; timed mode with 90 seconds, hints and scoring, or relaxed mode with no timer.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Hands the game in (copies `game/` and `screenshots/` out and writes `dossier.json`). To play it, serve the game folder with any static server, for example `python3 -m http.server 8080 -d game`, then open `http://localhost:8080` in a desktop browser.


## Files

- `main.ts`: The handover entry point that writes the dossier and bundles output.
- `vendor/makefun-game.ts`: The competition kit's dossier builder (do not edit).
- `game/index.html`: Page structure and view templates.
- `game/style.css`: All game and menu styling, responsive layout, animations.
- `game/src/paint.js`: SVG string building and drawing helpers.
- `game/src/scenes.js`: The three painted scenes (Sunny Park, Under the Sea, Savanna) and their difference lists.
- `game/src/render.js`: Scene rendering and found/hint SVG markers.
- `game/src/game.js`: Game rules, timer, score, audio beeps, and win/lose logic.
- `game/src/main.js`: Menu and screen wiring, audio toggle, and event listeners.
- `screenshots/`: Real captures of the running game.

## How to play

Pick a level; find every difference between the Original and the Changed picture; tap or click a difference on either picture to mark it on both; scoring is 100 points a find, 5 points a second left when you finish, a hint costs 50 points (3 a level) and a miss costs 3 seconds; in relaxed mode there is no clock.

---
<sub>Entered on [make.fun](https://make.fun/?ref=1htpds3w&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
