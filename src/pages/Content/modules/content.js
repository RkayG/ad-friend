const adSelectors = [
    'iframe[src*="doubleclick.net"]',
    'div[id*="google_ads"]',
    '.ad-container',
    '[aria-label="Advertisement"]'
  ];
  
  function replaceAds() {
    chrome.storage.sync.get("widgetType", ({ widgetType }) => {
      document.querySelectorAll(adSelectors.join(",")).forEach(ad => {
        ad.innerHTML = getWidget(widgetType);
        ad.style.background = "#f3f4f6";
        ad.style.padding = "10px";
        ad.style.borderRadius = "8px";
      });
    });
  }
  
  function getWidget(type) {
    const widgets = {
      "quote": "<div class='adfriend-widget'>🌟 Stay Positive! Keep pushing forward! 💪</div>",
      "reminder": "<div class='adfriend-widget'>⏳ Time for a quick stretch! Move around! 🏃</div>",
      "custom": "<div class='adfriend-widget'>✨ Your custom message here! ✨</div>"
    };
    return widgets[type] || widgets["quote"];
  }
  
  document.addEventListener("DOMContentLoaded", replaceAds);
  