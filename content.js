// content.js — Injected into Steam game pages
// Extracts the App ID, fetches ProtonDB rating, and injects the badge.

(async () => {
  const appId = getAppIdFromUrl(window.location.href);
  if (!appId) return;

  const badge = createBadge("loading");
  injectBadge(badge);

  // Ask background service worker to fetch ProtonDB (avoids CORS)
  const runtime = typeof browser !== "undefined" ? browser.runtime : chrome.runtime;
  runtime.sendMessage({ type: "FETCH_PROTONDB", appId }, (response) => {
    const tier = response?.tier?.toLowerCase() || "notrated";
    updateBadge(badge, tier);
  });
})();

// ---------------------------------------------------------------------------

function getAppIdFromUrl(url) {
  const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  return match ? match[1] : null;
}

const TIER_CONFIG = {
  native:   { label: "Native",   emoji: "🐧", color: "#7bc8f6" },
  platinum: { label: "Platinum", emoji: "🏆", color: "#b4c7dc" },
  gold:     { label: "Gold",     emoji: "🥇", color: "#cfb53b" },
  silver:   { label: "Silver",   emoji: "🥈", color: "#a8a9ad" },
  bronze:   { label: "Bronze",   emoji: "🥉", color: "#cd7f32" },
  borked:   { label: "Borked",   emoji: "💀", color: "#c0392b" },
  notrated: { label: "Not Rated",emoji: "❓", color: "#555555" },
  loading:  { label: "Loading…", emoji: "⏳", color: "#333333" },
};

function createBadge(tier) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.notrated;
  const badge = document.createElement("div");
  badge.id = "protonsteam-badge";
  badge.className = `protonsteam-badge protonsteam-tier-${tier}`;
  badge.innerHTML = `
    <span class="protonsteam-emoji">${cfg.emoji}</span>
    <span class="protonsteam-text">
      <span class="protonsteam-label">ProtonDB</span>
      <span class="protonsteam-tier">${cfg.label}</span>
    </span>
  `;
  return badge;
}

function updateBadge(badge, tier) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.notrated;
  badge.className = `protonsteam-badge protonsteam-tier-${tier}`;
  badge.querySelector(".protonsteam-emoji").textContent = cfg.emoji;
  badge.querySelector(".protonsteam-tier").textContent = cfg.label;

  // Update the ProtonDB link
  const appId = getAppIdFromUrl(window.location.href);
  if (appId) {
    badge.style.cursor = "pointer";
    badge.title = `View on ProtonDB`;
    badge.onclick = () =>
      window.open(`https://www.protondb.com/app/${appId}`, "_blank");
  }
}

function injectBadge(badge) {
  // Try to inject near the game title area; fall back to top of page
  const targets = [
    ".apphub_AppName",
    "#appHubAppName",
    ".page_title_area",
    "body",
  ];

  for (const selector of targets) {
    const el = document.querySelector(selector);
    if (el) {
      el.parentElement?.insertBefore(badge, el.nextSibling) ||
        el.appendChild(badge);
      return;
    }
  }

  document.body.prepend(badge);
}
