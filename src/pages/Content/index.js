// Content/index.js

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

// Create modal element
function createMovieModal(movie) {
  const modal = document.createElement('div');
  modal.className = 'movie-mate-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="modal-grid">
        <div class="modal-poster">
          <img src="${movie.imageUrl}" alt="${movie.title}">
        </div>
        <div class="modal-info">
          <h2>${movie.title}</h2>
          <div class="modal-meta">
            <span class="year">${movie.year}</span>
            <span class="rating">${movie.rating}</span>
            <span class="duration">${movie.duration || '120 min'}</span>
          </div>
          <p class="description">${movie.description || 'No description available.'}</p>
          <div class="genre-tags">
            ${(movie.genres || ['Action', 'Drama']).map(genre =>
    `<span class="genre-tag">${genre}</span>`
  ).join('')}
          </div>
          <div class="action-buttons">
            <button class="watch-trailer">Watch Trailer</button>
            <button class="add-watchlist">Add to Watchlist</button>
          </div>
        </div>
      </div>
    </div>
  `;

  return modal;
}

// Create movie poster element
function createMoviePoster(movie, originalDimensions) {
  const container = document.createElement('div');
  container.className = 'movie-mate-recommendation';

  container.style.width = `${originalDimensions.width}px`;
  container.style.height = `${originalDimensions.height}px`;

  const reviews = movie.reviews || [];
  const hasReviews = reviews.length > 0;

  container.innerHTML = `
    <div class="movie-poster-container">
      <div class="reviews-content">
        <div class="movie-header">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-rating">
            <span class="rating-star">★</span>
            <span class="rating-value">${movie.voteAverage?.toFixed(1) || '0'}</span>
            <span class="rating-count">(${movie.voteCount?.toLocaleString() || '0'} reviews)</span>
          </div>
        </div>

        <div class="reviews-section">
          ${hasReviews ? reviews.map(review => `
            <div class="review-card">
              <div class="reviewer-info">
                <div class="reviewer-name">${review.author}</div>
                <div class="review-rating">
                  ${review.author_details?.rating ?
      `<span class="rating-star">★</span>
                     <span class="rating-value">${review.author_details.rating}/10</span>`
      : ''}
                </div>
              </div>
              <div class="review-content">
                "${review.content.length > 150 ?
      review.content.substring(0, 150) + '...' :
      review.content}"
              </div>
            </div>
          `).join('') : `
            <div class="no-reviews">
              No reviews available yet. Be the first to review!
            </div>
          `}
        </div>

        <div class="quick-actions">
          ${movie.trailerKey ? `
            <button class="action-btn play-btn" title="Watch Trailer">▶</button>
          ` : ''}
          <button class="action-btn info-btn" title="More Info">i</button>
          <button class="action-btn like-btn" title="Add to Favorites">♥</button>
        </div>
      </div>
    </div>
  `;


  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
      .movie-mate-recommendation {
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
  
      .movie-mate-recommendation:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      }
  
      .movie-poster-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
  
      .reviews-content {
        height: 100%;
        padding: 1.5rem;
        color: white;
        display: flex;
        flex-direction: column;
      }
  
      .movie-header {
        margin-bottom: 1rem;
      }
  
      .movie-title {
        margin: 0;
        font-size: min(1.4rem, 14%);
        font-weight: bold;
        color: #fff;
      }
  
      .movie-rating {
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
  
      .rating-star {
        color: #ffd700;
      }
  
      .rating-value {
        font-weight: bold;
        font-size: min(1.1rem, 12%);
      }
  
      .rating-count {
        opacity: 0.7;
        font-size: min(0.9rem, 10%);
      }
  
      .reviews-section {
        flex-grow: 1;
        overflow-y: auto;
        margin: 1rem 0;
      }
  
      .review-card {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
  
      .reviewer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
      }
  
      .reviewer-name {
        font-weight: bold;
        font-size: min(0.9rem, 10%);
        color: #ffd700;
      }
  
      .review-rating {
        font-size: min(0.8rem, 9%);
      }
  
      .review-content {
        font-size: min(0.9rem, 10%);
        line-height: 1.4;
        font-style: italic;
        color: rgba(255,255,255,0.9);
      }
  
      .no-reviews {
        text-align: center;
        padding: 2rem;
        color: rgba(255,255,255,0.6);
        font-style: italic;
      }
  
      .quick-actions {
        display: flex;
        gap: 8px;
        margin-top: auto;
        justify-content: center;
      }
  
      .action-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.1);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
  
      .action-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
  
      .play-btn:hover {
        background: #e50914;
      }
  
      .like-btn.active {
        background: #e50914;
      }

    /* Modal Styles */
    .movie-mate-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-mate-modal.active {
      display: flex;
      opacity: 1;
    }

    .modal-content {
      position: relative;
      width: 90%;
      max-width: 800px;
      margin: auto;
      background: #1a1a1a;
      border-radius: 12px;
      padding: 24px;
      color: white;
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }

    .movie-mate-modal.active .modal-content {
      transform: translateY(0);
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 24px;
    }

    .modal-poster img {
      width: 100%;
      border-radius: 8px;
    }

    .close-modal {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 24px;
      cursor: pointer;
      color: white;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .close-modal:hover {
      opacity: 1;
    }

    .genre-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0;
    }

    .genre-tag {
      padding: 4px 12px;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .action-buttons button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .watch-trailer {
      background: #e50914;
      color: white;
    }

    .add-watchlist {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .watch-trailer:hover {
      background: #f40612;
    }

    .add-watchlist:hover {
      background: rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(styles);

  // Add event listeners
  const poster = container.querySelector('.movie-poster-container');
  const likeBtn = container.querySelector('.like-btn');
  const playBtn = container.querySelector('.play-btn');
  const infoBtn = container.querySelector('.info-btn');

  // Like button toggle
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    likeBtn.classList.toggle('active');
    chrome.runtime.sendMessage({
      type: 'TOGGLE_FAVORITE',
      movieId: movie.id
    });
  });

  // Play button (trailer)
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: 'PLAY_TRAILER',
      movieId: movie.id
    });
  });

  // Info button (modal)
  infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showMovieModal(movie);
  });

  return container;
}

// Show movie modal
function showMovieModal(movie) {
  const modal = createMovieModal(movie);
  document.body.appendChild(modal);

  // Animation timing
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);

  // Close modal handlers
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });

  // Button handlers
  const watchTrailerBtn = modal.querySelector('.watch-trailer');
  const addWatchlistBtn = modal.querySelector('.add-watchlist');

  watchTrailerBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'PLAY_TRAILER',
      movieId: movie.id
    });
  });

  addWatchlistBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'ADD_TO_WATCHLIST',
      movieId: movie.id
    });
    addWatchlistBtn.textContent = 'Added to Watchlist';
    addWatchlistBtn.disabled = true;
  });
}

// Rest of the code remains the same (replaceAd function, observer setup, etc.)
// Function to replace ad with movie poster
async function replaceAd(adElement) {
  console.log("Content Script: Checking element for ad replacement:", adElement);

  if (replacedElements.has(adElement)) {
    console.log("Content Script: Element already replaced, skipping:", adElement);
    return;
  }

  // Get the ad element's dimensions
  const rect = adElement.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(adElement);

  // Calculate the actual dimensions including padding and border
  const dimensions = {
    width: rect.width - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)),
    height: rect.height - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom))
  };

  // Only replace if the ad is visible and has reasonable dimensions
  if (dimensions.width < 100 || dimensions.height < 100) {
    console.log("Content Script: Ad too small, skipping:", adElement, dimensions.width, dimensions.height);
    return;
  }

  // Request a movie recommendation
  try {
    console.log("Content Script: Requesting movie recommendation");
    const response = await chrome.runtime.sendMessage({
      type: 'GET_RECOMMENDATION'
    });
    console.log("Content Script: Received movie recommendation response:", response);

    if (response?.recommendation) {
      const posterElement = createMoviePoster(response.recommendation, dimensions);
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