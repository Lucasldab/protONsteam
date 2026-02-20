# protONsteam 🐧

A cross-browser extension that shows **ProtonDB** compatibility ratings directly on Steam game pages — right next to the game title, no tab switching needed.

> **Disclaimer:** protONsteam is an unofficial community project. It is not affiliated with, endorsed by, or connected to ProtonDB, Valve, or Steam in any way. It uses ProtonDB's public API which is unofficial and may change at any time.

---

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

---

## Installation

### Firefox (recommended)
Install directly from the Firefox Add-ons store:

**[→ Install on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/protonsteam/)**

### Chrome / Chromium / Edge
1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `protONsteam/` folder

### Manual Firefox install (developer)
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `manifest.json` inside the project folder

> Temporary add-ons are removed when Firefox closes. Use the AMO link above for a permanent install.

---

## How it works

1. When you visit a Steam game page (`store.steampowered.com/app/{appId}/...`), the content script extracts the **App ID** from the URL.
2. It sends a message to the background script, which fetches the rating from the **ProtonDB public API**:
   ```
   https://www.protondb.com/api/v1/reports/summaries/{appId}.json
   ```
3. A styled badge is injected inline next to the game title showing the tier.
4. Clicking the badge opens the game's full ProtonDB page in a new tab.

### Permissions used

| Permission | Why |
|---|---|
| `store.steampowered.com` | To inject the badge on Steam game pages |
| `www.protondb.com` | To fetch the compatibility rating |

No data is collected, stored, or transmitted beyond these two requests.

---

## Project structure

```
protONsteam/
├── manifest.json    # Extension manifest (MV3, cross-browser)
├── background.js    # Background script — handles ProtonDB API fetch
├── content.js       # Injected into Steam pages — renders the badge
├── styles.css       # Badge styles
├── icons/           # Extension icons (16, 48, 128px)
└── README.md
```

---

## Contributing

PRs are welcome! Some ideas for future improvements:

- Show the number of reports alongside the tier
- Add a confidence score indicator
- Support Steam search/browse pages (inline badges per game)
- Option to disable the badge on specific games

To contribute:
1. Fork the repo
2. Create a branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.
