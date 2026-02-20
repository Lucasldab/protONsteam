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

  var emojiSpan = document.createElement("span");
  emojiSpan.className = "protonsteam-emoji";
  emojiSpan.textContent = cfg.emoji;

  var textSpan = document.createElement("span");
  textSpan.className = "protonsteam-text";

  var labelSpan = document.createElement("span");
  labelSpan.className = "protonsteam-label";
  labelSpan.textContent = "ProtonDB";

  var tierSpan = document.createElement("span");
  tierSpan.className = "protonsteam-tier";
  tierSpan.textContent = cfg.label;

  textSpan.appendChild(labelSpan);
  textSpan.appendChild(tierSpan);
  badge.appendChild(emojiSpan);
  badge.appendChild(textSpan);

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
  ];
  for (var i = 0; i < targets.length; i++) {
    var el = document.querySelector(targets[i]);
    if (el) {
      var wrapper = document.createElement("div");
      wrapper.id = "protonsteam-wrapper";
      wrapper.style.cssText = "display:inline-flex;align-items:center;gap:12px;flex-wrap:wrap;width:100%;";
      el.parentElement.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(badge);
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
