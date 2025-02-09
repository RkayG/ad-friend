// Content/adReplacer.js

// Common ad container selectors
const AD_SELECTORS = [
  '[id*="ad-"]',
  '[class*="ad-"]',
  '[id*="banner"]',
  '[class*="banner"]',
  '[id*="advert"]',
  '[class*="advert"]',
  'ins.adsbygoogle',
  '[id*="google_ads"]',
  '[id*="dfp-"]'
];

// Keep track of replaced ads to avoid duplicates
const replacedElements = new Set();

// Create movie poster element
function createMoviePoster(movie) {
  const container = document.createElement('div');
  container.className = 'movie-mate-recommendation';

  container.innerHTML = `
    <div class="movie-poster-container">
      <img src="${movie.imageUrl}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="movie-meta">
          <span>${movie.year}</span>
          <span>${movie.rating}</span>
        </div>
        <button class="more-info-btn">Learn More</button>
      </div>
    </div>
  `;

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    .movie-mate-recommendation {
      width: 100%;
      height: 100%;
      min-height: 200px;
      overflow: hidden;
      border-radius: 8px;
      position: relative;
      background: #1a1a1a;
    }

    .movie-poster-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .movie-poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .movie-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.9));
      color: white;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .movie-poster-container:hover .movie-info {
      transform: translateY(0);
    }

    .movie-poster-container:hover .movie-poster {
      transform: scale(1.05);
    }

    .movie-info h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: bold;
    }

    .movie-meta {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .movie-meta span {
      margin-right: 1rem;
    }

    .more-info-btn {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background: #e50914;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .more-info-btn:hover {
      background: #f40612;
    }
  `;
  document.head.appendChild(styles);

  // Add click handler to open popup
  container.querySelector('.more-info-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'GET_RECOMMENDATION',
      category: 'action' // You could make this dynamic based on the movie genre
    });
  });

  return container;
}

// Function to replace ad with movie poster
async function replaceAd(adElement) {
  console.log("Content Script: Checking element for ad replacement:", adElement);

  if (replacedElements.has(adElement)) {
    console.log("Content Script: Element already replaced, skipping:", adElement);
    return;
  }

  // Get the ad element's dimensions
  const rect = adElement.getBoundingClientRect();

  // Only replace if the ad is visible and has reasonable dimensions
  if (rect.width < 100 || rect.height < 100) {
    console.log("Content Script: Ad too small, skipping:", adElement, rect.width, rect.height);
    return;
  }

  // Request a movie recommendation
  try {
    console.log("Content Script: Requesting movie recommendation");
    const response = await chrome.runtime.sendMessage({
      type: 'GET_RECOMMENDATION',
      //category: 'random' // You could make this dynamic based on page content
    });
    console.log("Content Script: Received movie recommendation response:", response);

    if (response?.recommendation) {
      const posterElement = createMoviePoster(response.recommendation);
      adElement.parentNode.replaceChild(posterElement, adElement);
      replacedElements.add(posterElement);
      console.log("Ad replaced successfully:", posterElement);
    } else {
      console.log("No recommendation received, not replacing ad.");
    }
  } catch (error) {
    console.error('Error replacing ad:', error);
  }
}

// Observer to watch for new ad elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        console.log("Mutation observed, checking node:", node);
        // Check if the new node matches ad selectors
        if (AD_SELECTORS.some(selector => node.matches(selector))) {
          console.log("New node matches ad selector:", node);
          replaceAd(node);
        }
        // Check child nodes
        node.querySelectorAll(AD_SELECTORS.join(',')).forEach(replaceAd);
      }
    });
  });
});

// Start observing
console.log("Starting ad replacement observer");
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial scan for existing ads
console.log("Initial scan for existing ads");
document.querySelectorAll(AD_SELECTORS.join(',')).forEach(replaceAd);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'AD_BLOCKED') {
    console.log("AD_BLOCKED message received, rescanning for ads");
    // Rescan the page for new ads
    document.querySelectorAll(AD_SELECTORS.join(',')).forEach(replaceAd);
  }
});