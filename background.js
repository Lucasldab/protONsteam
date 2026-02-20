// background.js — Service worker
// Handles ProtonDB API requests on behalf of content scripts
// to avoid CORS issues.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_PROTONDB") {
    const { appId } = message;
    fetch(`https://www.protondb.com/api/v1/reports/summaries/${appId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((data) => sendResponse({ success: true, tier: data.tier }))
      .catch(() => sendResponse({ success: false, tier: "notrated" }));

    // Return true to keep the message channel open for async response
    return true;
  }
});
