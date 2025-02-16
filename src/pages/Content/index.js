// Content/index.js
import './content.styles.css';
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

// Add this function to create the review modal
function createReviewModal(review) {
  const modal = document.createElement('div');
  modal.className = 'review-modal';
  modal.innerHTML = `
    <div class="review-modal-content">
      <span class="close-modal">&times;</span>
      <div class="review-modal-header">
        <div class="reviewer-info">
          <h3 class="reviewer-name">${review.author}</h3>
          ${review.author_details?.rating ? `
            <div class="review-rating">
              <span class="rating-star">★</span>
              <span class="rating-value">${review.author_details.rating}/10</span>
            </div>
          ` : ''}
        </div>
        <div class="review-date">
          ${new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
        </div>
      </div>
      <div class="review-modal-body">
        <p class="full-review">${review.content}</p>
      </div>
    </div>
  `;

  return modal;
}
// trailer modal
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
            <span class="duration">${movie.runtime || '120 min'}</span>
          </div>
          <p class="description">${movie.description || 'No description available.'}</p>
          <div class="genre-tags">
            ${(movie.genres || ['Action', 'Drama']).map(genre =>
    `<span class="genre-tag">${genre}</span>`
  ).join('')}
          </div>
          <div class="action-buttons">
            ${movie.trailerKey ? `<button class="watch-trailer">Watch Trailer</button>` : ''}
            <button class="add-watchlist">
              <span class="add-text">Add to Watchlist</span>
              <span class="added-text" style="display: none;">Added to Watchlist</span>
            </button>
          </div>
          <div class="trailer-container" style="display: none;">
            <iframe 
              id="trailer-player"
              width="100%" height="315"
              src="https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listener for trailer button
  modal.querySelector('.watch-trailer')?.addEventListener('click', () => {
    modal.querySelector('.trailer-container').style.display = 'block';
  });

  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

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
                "${review.content.length > 300 ?
      review.content.substring(0, 300) + '...' :
      review.content}"
              </div>
               ${review.content.length > 300 ?
      `<button class="read-more-btn">Read Full Review</button>` :
      ''}
            </div>
          `).join('') : `
            <div class="no-reviews">
              No reviews available yet.
            </div>
          `}
        </div>

        <div class="quick-actions">
          ${movie.trailerKey ? `
            <button class="action-btn play-btn" title="Watch Trailer">▶</button>
          ` : ''}
          <button class="action-btn info-btn" title="More Info">i</button>
          <button class="action-btn like-btn addWatchlistButton" title="Add to Watchlist">♥</button>
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
        gap: 1rem;
      }

  
      .movie-header {
        margin-bottom: 1rem;
      }
  
      .movie-title {
        font-weight: 600;
        margin: 0;
        font-size: 1.4rem;
        color: #fff;
        letter-spacing: -0.02em;
      }
  
      .movie-rating {
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
  
      .rating-star {
        color: #ffd700;
        font-size: 1.2rem;
      }
  
      .rating-value {
        font-weight: 600;
        font-size: 1.1rem
      }
  
      .rating-count {
        opacity: 0.7;
        font-size: 0.9rem;
        color: rgba(255,255,255,0.7);
      }
      .reviews-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .reviews-section::-webkit-scrollbar {
      width: 4px;
    }

    .reviews-section::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }

    .reviews-section::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 4px;
    }

    .review-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 1rem;
      transition: transform 0.2s ease;
    }

    .review-card:hover {
      transform: translateX(4px);
      background: rgba(255, 255, 255, 0.12);
    }

    .reviewer-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }

    .reviewer-name {
      font-weight: 600;
      font-size: 1rem;
      color: #ffd700;
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.9);
    }

    .review-content {
      font-size: 0.95rem;
      line-height: 1.5;
      color: rgba(255,255,255,0.85);
      font-style: italic;
    }

    .no-reviews {
      text-align: center;
      padding: 2rem;
      color: rgba(255,255,255,0.7);
      font-size: 1rem;
      font-style: italic;
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
    }
      
      .quick-actions {
        display: flex;
        position: absolute;
        width: 100%;
        justify-content: center;
        bottom: 0;
        left: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.9));
        transform: translateY(100%);
        transition: transform 0.3s ease;
        padding: 8px;
        border-radius: 8px;
        gap: 8px;
      }

      .movie-poster-container:hover .quick-actions {
        transform: translateY(0);
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
      overflow-y: auto;
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
  const addWatchlistButton = container.querySelector('.addWatchlistButton');

  // Check initial watchlist state
  checkIfInWatchlist(movie.id).then(isInWatchlist => {
    if (isInWatchlist) {
      likeBtn.classList.add('active');
    }
  });

  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWatchlist(movie, likeBtn);
  });

  // Play button (trailer)
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showMovieModal(movie);
  });

  // Info button (modal)
  infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showMovieModal(movie);
  });

  container.querySelectorAll('.read-more-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const review = reviews[index];
      const reviewModal = createReviewModal(review);
      document.body.appendChild(reviewModal);

      // Animation timing
      setTimeout(() => {
        reviewModal.classList.add('active');
      }, 10);

      // Close modal handlers
      const closeBtn = reviewModal.querySelector('.close-modal');
      closeBtn.addEventListener('click', () => {
        reviewModal.classList.remove('active');
        setTimeout(() => {
          reviewModal.remove();
        }, 300);
      });

      reviewModal.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
          reviewModal.classList.remove('active');
          setTimeout(() => {
            reviewModal.remove();
          }, 300);
        }
      });
    });
  });

  return container;
}

function showFeedbackToast(message) {
  const toast = document.createElement('div');
  toast.className = 'feedback-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Remove toast after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

async function checkIfInWatchlist(movieId) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['watchlist'], (result) => {
      const watchlist = result.watchlist || [];
      resolve(watchlist.some(item => item.id === movieId));
    });
  });
}

async function toggleWatchlist(movie, likeBtn) {
  const isInWatchlist = await checkIfInWatchlist(movie.id);

  if (isInWatchlist) {
    // Remove from watchlist
    chrome.runtime.sendMessage({
      type: 'REMOVE_FROM_WATCHLIST',
      movieId: movie.id
    }, (response) => {
      if (response?.success) {
        likeBtn.classList.remove('active');
        showFeedbackToast(`${movie.title} removed from watchlist`);
      }
    });
  } else {
    // Add to watchlist
    chrome.runtime.sendMessage({
      type: 'ADD_TO_WATCHLIST',
      movie: movie
    }, (response) => {
      if (response?.success) {
        likeBtn.classList.add('active');
        showFeedbackToast(`${movie.title} added to watchlist`);
      }
    });
  }
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
  const addText = modal.querySelector('.add-text');
  const addedText = modal.querySelector('.added-text');

  checkIfInWatchlist(movie.id).then(isInWatchlist => {
    if (isInWatchlist) {
      addText.style.display = 'none';
      addedText.style.display = 'inline';
      addWatchlistBtn.disabled = true;
      addWatchlistBtn.classList.add('in-watchlist');
    }
  });

  addWatchlistBtn.addEventListener('click', async () => {
    const isInWatchlist = await checkIfInWatchlist(movie.id);
    if (!isInWatchlist) {
      chrome.runtime.sendMessage({
        type: 'ADD_TO_WATCHLIST',
        movie: movie
      }, (response) => {
        if (response?.success) {
          addText.style.display = 'none';
          addedText.style.display = 'inline';
          addWatchlistBtn.disabled = true;
          addWatchlistBtn.classList.add('in-watchlist');
          showFeedbackToast(`${movie.title} added to watchlist`);
        }
      });
    }
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