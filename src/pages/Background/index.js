//Background/index.js

const TMDB_API_KEY = '46a46785be10d4120686d84440159e11'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

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

// Listen for blocked requests using declarativeNetRequest.getMatchedRules instead
async function checkBlockedRequests() {
    try {
        const rules = await chrome.declarativeNetRequest.getMatchedRules({});
        if (rules && rules.length > 0) {
            blockedAdsCount += rules.length;
            console.log(`Ads blocked: ${blockedAdsCount}`);

            // Notify content script about blocked ads
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: 'AD_BLOCKED',
                        count: blockedAdsCount
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error checking blocked requests:', error);
    }
}

// Set up periodic checking
setInterval(checkBlockedRequests, 12000); // Check every 12 seconds

// fetch movie reviews by specific movie ID 
async function fetchMovieReviews(movieId) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        return data.results.slice(0, 2); // Get the first review
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return null;
    }
}

// fetch movie trailer for a specific movie ID
async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        return data.results.find(video => video.type === 'Trailer') || null;
    } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
    }
}

// Fetch movie recommendations from TMDB for a specific genre
async function fetchNewRecommendations(genre) {
    try {
        const genreIds = {
            action: 28, comedy: 35, drama: 18, scifi: 878, horror: 27,
            romance: 10749, thriller: 53, fantasy: 14, mystery: 9648,
            animation: 16, adventure: 12, crime: 80
        };

        const genreId = genreIds[genre];
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
        );
        const data = await response.json();

        // Process movies and filter out those without reviews
        const moviesWithReviews = await Promise.all(data.results.map(async movie => {
            const reviews = await fetchMovieReviews(movie.id);
            if (!reviews || reviews.length === 0) return null; // Exclude movies without reviews

            const trailer = await fetchMovieTrailer(movie.id);

            return {
                id: movie.id,
                title: movie.title,
                year: new Date(movie.release_date).getFullYear(),
                rating: movie.vote_average,
                imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                voteAverage: movie.vote_average,
                voteCount: movie.vote_count,
                description: movie.overview,
                reviews,
                criticsScore: Math.round(movie.vote_average * 10),
                audienceScore: Math.round((movie.popularity / 1000) * 100),
                trailerKey: trailer ? trailer.key : null
            };
        }));

        // Filter out null values (movies without reviews)
        cachedRecommendations[genre] = moviesWithReviews.filter(movie => movie !== null);
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
            console.log('no cached recommendation')
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