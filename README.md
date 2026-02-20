# protONsteam 🐧

A cross-browser extension that shows **ProtonDB** compatibility ratings directly on Steam game pages — no more switching tabs to check if a game runs on Linux.

## Ratings

| Tier | Meaning |
|------|---------|
| 🐧 Native | Has a native Linux build |
| 🏆 Platinum | Works perfectly out of the box via Proton |
| 🥇 Gold | Works great with minor tweaks |
| 🥈 Silver | Works with some issues |
| 🥉 Bronze | Runs but expect significant problems |
| 💀 Borked | Does not run at all |
| ❓ Not Rated | No reports on ProtonDB yet |

## Installation

### Chrome / Chromium / Edge
1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `protONsteam/` folder

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select the `manifest.json` file inside the `protONsteam/` folder

> For permanent Firefox installation, the extension would need to be signed via [addons.mozilla.org](https://addons.mozilla.org).

## How it works

1. When you visit a Steam game page (`store.steampowered.com/app/{appId}/...`), the content script extracts the **App ID** from the URL.
2. It sends a message to the background service worker, which fetches the rating from the **ProtonDB public API**:
   ```
   https://www.protondb.com/api/v1/reports/summaries/{appId}.json
   ```
3. A styled badge is injected near the game title on the page showing the tier.
4. Clicking the badge opens the game's ProtonDB page in a new tab.

## Project structure

```
protONsteam/
├── manifest.json    # Extension manifest (MV3, cross-browser)
├── background.js    # Service worker — handles ProtonDB API fetch
├── content.js       # Injected into Steam pages — renders the badge
├── styles.css       # Badge styles
├── icons/           # Extension icons (16, 48, 128px)
└── README.md
```

## Icons

Place your icons in the `icons/` folder:
- `icon16.png` — 16×16px
- `icon48.png` — 48×48px
- `icon128.png` — 128×128px

You can generate them from any PNG using [Squoosh](https://squoosh.app/) or ImageMagick:
```bash
convert icon.png -resize 16x16 icons/icon16.png
convert icon.png -resize 48x48 icons/icon48.png
convert icon.png -resize 128x128 icons/icon128.png
```

## Contributing

PRs welcome! Some ideas for future improvements:
- Show the number of reports alongside the tier
- Add a confidence score
- Support Steam search result pages (show inline badges per game)
- Dark/light theme toggle for the badge

## License

MIT
