// Content/index.js
console.log('console script is working')

let notificationBadge = null;

// Create and inject notification badge
function createNotificationBadge() {
  if (notificationBadge) {
    return; // Don't create duplicate badges
  }
  notificationBadge = document.createElement('div');
  notificationBadge.innerHTML = `
        <div class="movie-mate-notification hidden">
            <div class="notification-content">
                <span class="icon">🎬</span>
                <span class="text">Ad blocked! Click for a movie recommendation</span>
                <span class="count">0</span>
            </div>
        </div>
    `;

  const styles = document.createElement('style');
  styles.textContent = `
        .movie-mate-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(147, 51, 234, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-family: system-ui;
            z-index: 999999;
            transform: translateY(100px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            backdrop-filter: blur(8px);
        }

        .movie-mate-notification.visible {
            transform: translateY(0);
        }

        .movie-mate-notification.hidden {
            transform: translateY(100px);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .count {
            background: rgba(255, 255, 255, 0.2);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
        }

        .icon {
            font-size: 1.2em;
        }
    `;

  document.head.appendChild(styles);
  document.body.appendChild(notificationBadge);

  // Add click handler to open popup
  notificationBadge.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATION', category: 'action' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      // Open the popup
      chrome.action.openPopup();
    });
  });
}

// Update notification badge
function updateNotification(count) {
  if (!notificationBadge) {
    createNotificationBadge();
  }

  const notification = notificationBadge.querySelector('.movie-mate-notification');
  const countElement = notification.querySelector('.count');
  countElement.textContent = count;

  notification.classList.remove('hidden');
  notification.classList.add('visible');

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('visible');
    notification.classList.add('hidden');
  }, 3000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'AD_BLOCKED') {
    updateNotification(message.count);
  }
});

// Initialize
createNotificationBadge();