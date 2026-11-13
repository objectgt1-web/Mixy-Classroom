

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blockedSites"], (data) => {
    if (!data.blockedSites) {
      chrome.storage.local.set({
        blockedSites: [
          "example.com"
        ],
        classroomEnabled: true
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  chrome.storage.local.get(
    ["blockedSites", "classroomEnabled"],
    (data) => {
      if (!data.classroomEnabled) return;

      let blocked = data.blockedSites || [];

      try {
        const host = new URL(tab.url).hostname;

        if (blocked.some(site =>
          host === site || host.endsWith("." + site)
        )) {
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL("popup.html")
          });
        }
      } catch (error) {
        console.error("Mixy Blocker:", error);
      }
    }
  );
});
