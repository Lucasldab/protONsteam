// content.js — Injected into Steam game pages

const TIER_CONFIG = {
  native:   { label: "Native",    emoji: "\uD83D\uDC27", color: "#7bc8f6" },
  platinum: { label: "Platinum",  emoji: "\uD83C\uDFC6", color: "#b4c7dc" },
  gold:     { label: "Gold",      emoji: "\uD83E\uDD47", color: "#cfb53b" },
  silver:   { label: "Silver",    emoji: "\uD83E\uDD48", color: "#a8a9ad" },
  bronze:   { label: "Bronze",    emoji: "\uD83E\uDD49", color: "#cd7f32" },
  borked:   { label: "Borked",    emoji: "\uD83D\uDC80", color: "#c0392b" },
  notrated: { label: "Not Rated", emoji: "?",            color: "#555555" },
  loading:  { label: "Loading...", emoji: "...",          color: "#333333" },
};

function getAppIdFromUrl(url) {
  var match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  return match ? match[1] : null;
}

function createBadge(tier) {
  var cfg = TIER_CONFIG[tier] || TIER_CONFIG.notrated;
  var badge = document.createElement("div");
  badge.id = "protonsteam-badge";
  badge.className = "protonsteam-badge protonsteam-tier-" + tier;
  badge.innerHTML =
    '<span class="protonsteam-emoji">' + cfg.emoji + '</span>' +
    '<span class="protonsteam-text">' +
      '<span class="protonsteam-label">ProtonDB</span>' +
      '<span class="protonsteam-tier">' + cfg.label + '</span>' +
    '</span>';
  return badge;
}

function updateBadge(badge, tier) {
  var cfg = TIER_CONFIG[tier] || TIER_CONFIG.notrated;
  badge.className = "protonsteam-badge protonsteam-tier-" + tier;
  badge.querySelector(".protonsteam-emoji").textContent = cfg.emoji;
  badge.querySelector(".protonsteam-tier").textContent = cfg.label;

  var appId = getAppIdFromUrl(window.location.href);
  if (appId) {
    badge.style.cursor = "pointer";
    badge.title = "View on ProtonDB";
    badge.onclick = function() {
      window.open("https://www.protondb.com/app/" + appId, "_blank");
    };
  }
}

function injectBadge(badge) {
  var targets = [
    ".apphub_AppName",
    "#appHubAppName",
    ".page_title_area",
    "body",
  ];
  for (var i = 0; i < targets.length; i++) {
    var el = document.querySelector(targets[i]);
    if (el) {
      if (el.parentElement) {
        el.parentElement.insertBefore(badge, el.nextSibling);
      } else {
        el.appendChild(badge);
      }
      return;
    }
  }
  document.body.prepend(badge);
}

(function() {
  var appId = getAppIdFromUrl(window.location.href);
  if (!appId) return;

  var badge = createBadge("loading");
  injectBadge(badge);

  var ext = typeof browser !== "undefined" ? browser : chrome;
  ext.runtime.sendMessage({ type: "FETCH_PROTONDB", appId: appId }, function(response) {
    var tier = (response && response.tier) ? response.tier.toLowerCase() : "notrated";
    updateBadge(badge, tier);
  });
})();
