
console.log('Service worker loaded');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

// Track blocked ads count
let blockedAdsCount = 0;

console.log("Blocked ads count:", blockedAdsCount);  // To track ad blocking events

// Store movie recommendations by category
let cachedRecommendations = {
    action: [],
    comedy: [],
    drama: [],
    scifi: [],
    horror: [],
    romance: [],
    thriller: [],
    fantasy: [],
    mystery: [],
    animation: [],
    adventure: [],
    crime: []
};

// Initialize ad blocker rules
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed, initializing ad blocker rules");
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [
            {
                id: 1,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*',
                    resourceTypes: ['image', 'sub_frame', 'script'],
                    domains: ['doubleclick.net', 'google-analytics.com', 'adnxs.com']
                }
            }
        ]
    });

    // Initial fetch of recommendations for each genre
    Object.keys(cachedRecommendations).forEach(genre => {
        fetchNewRecommendations(genre);
    });
});
/* 
// Listen for blocked requests
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (e) => {
    blockedAdsCount++;

    // Notify content script about blocked ad
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'AD_BLOCKED',
                count: blockedAdsCount
            });
        }
    });
});
 */
// Fetch movie recommendations from TMDB for a specific genre
async function fetchNewRecommendations(genre) {
    try {
        // Map our genre categories to TMDB genre IDs
        const genreIds = {
            action: 28,
            comedy: 35,
            drama: 18,
            scifi: 878,
            horror: 27,
            romance: 10749,
            thriller: 53,
            fantasy: 14,
            mystery: 9648,
            animation: 16,
            adventure: 12,
            crime: 80
        };

        const genreId = genreIds[genre];
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
        );
        const data = await response.json();

        // Transform the data to match UI requirements
        cachedRecommendations[genre] = data.results.map(movie => ({
            title: movie.title,
            year: new Date(movie.release_date).getFullYear(),
            rating: movie.adult ? 'R' : 'PG-13', // Simplified rating logic
            runtime: '120 min', // TMDB doesn't provide runtime in discover endpoint
            imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            description: movie.overview
        }));
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);

    if (request.type === 'GET_BLOCKED_COUNT') {
        sendResponse({ count: blockedAdsCount });
    }

    if (request.type === 'GET_RECOMMENDATION') {
        const category = request.category || 'action';

        // If category is empty, fetch new recommendations
        if (cachedRecommendations[category].length === 0) {
            fetchNewRecommendations(category).then(() => {
                const recommendation = getRandomRecommendation(category);
                sendResponse({ recommendation, count: blockedAdsCount }); // Send count as well
            });
            return true; // asynchronous response
        }

        const recommendation = getRandomRecommendation(category);
        sendResponse({ recommendation, count: blockedAdsCount }); // Send count here too
    }
});

// Helper function to get a random recommendation from a category
function getRandomRecommendation(category) {
    const recommendations = cachedRecommendations[category];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
}