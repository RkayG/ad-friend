import React, { useState, useEffect } from 'react';
import { Film, List, Settings, RefreshCw, Heart, Trash, Star, ChevronLeft, ChevronRight } from 'lucide-react';


const Popup = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [recommendationCategory, setRecommendationCategory] = useState('action');
  const [watchlist, setWatchlist] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const [reviews, setReviews] = useState([]);


  const fetchWatchlist = () => {
    chrome.storage.local.get(['watchlist'], (result) => {
      if (result.watchlist) {
        console.log('Fetched Watchlist:', result.watchlist);
        setWatchlist(result.watchlist);
      }
    });
  };

  // storage change listener
  useEffect(() => {
    const handleStorageChange = (changes, namespace) => {
      if (namespace === 'sync' && changes.watchlist) {
        console.log('Storage changed:', changes.watchlist.newValue);
        setWatchlist(changes.watchlist.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const addToWatchlist = (movie) => {
    const isAlreadyAdded = watchlist.some(item => item.id === movie.id);

    if (isAlreadyAdded) {
      setFeedback({ message: `${movie.title} is already in your watchlist!`, type: 'error' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    } else {
      const updatedWatchlist = [...watchlist, movie];

      chrome.storage.local.set({ watchlist: updatedWatchlist }, () => {
        if (chrome.runtime.lastError) {
          console.error('Detailed storage error:', chrome.runtime.lastError);
          setFeedback({
            message: `Error saving to watchlist: ${chrome.runtime.lastError.message}`,
            type: 'error'
          });
          return;
        }

        fetchWatchlist();
        setFeedback({ message: `${movie.title} added to watchlist!`, type: 'success' });
      });
    }
    setTimeout(() => setFeedback(null), 2000);
  };


  const removeFromWatchlist = (id) => {
    const updatedWatchlist = watchlist.filter(movie => movie.id !== id);
    chrome.storage.local.set({ watchlist: updatedWatchlist }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error removing from storage:', chrome.runtime.lastError);
        return;
      }
      fetchWatchlist(); // Explicitly fetch to ensure UI is in sync
    });
  };

  const clearWatchlist = () => {
    chrome.storage.local.set({ watchlist: [] }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing storage:', chrome.runtime.lastError);
        return;
      }
      fetchWatchlist(); // Explicitly fetch to ensure UI is in sync
    });
  };


  const fetchRecommendation = () => {
    chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATION' }, (response) => {
      if (response?.recommendation) {
        setCurrentRecommendation(response.recommendation);
        setReviews(response.recommendation.reviews);
      }
    });
  };

  // Initial fetch when the component mounts
  useEffect(() => { fetchWatchlist(); }, []);
  useEffect(() => { fetchRecommendation(); }, []);


  const renderContent = () => {
    if (activeTab === 'watchlist') {
      console.log('watchlist', watchlist)
      return (
        <div className="space-y-4 overflow-y-auto  h-[350px]">
          {watchlist.length > 0 ? (
            <>
              {watchlist.map((movie) => (
                <div key={movie.id} className="flex items-center bg-slate-800 p-3 rounded-lg shadow-md">
                  <img src={movie.imageUrl} alt={movie.title} className="w-16 h-20 rounded-md object-cover" />
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-sky-300">{movie.title}</h3>
                    <p className="text-xs text-slate-400">{movie.year} • {movie.rating} • {movie.runtime}</p>
                  </div>
                  <button onClick={() => removeFromWatchlist(movie.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button onClick={clearWatchlist} className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-2">
                Clear Watchlist
              </button>
            </>
          ) : (
            <p className="text-center text-slate-400">Your watchlist is empty.</p>
          )}
        </div>
      );
    }

    if (activeTab === 'reviews') {

      return (
        <div className="space-y-4 overflow-y-auto h-[350px] p-4 bg-slate-800 rounded-lg shadow-md">
          <div className='flex justify-between'>
            <h3 className="text-lg font-semibold font-serif italic text-sky-400">Reviews</h3>
            <p className="text-xs mt-2 font-serif italic font-semibold text-orange-400">{currentRecommendation.title}</p>
          </div>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="bg-slate-700 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sky-300 font-medium">{review.author}</span>
                  {review.author_details?.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-slate-300 font-mono">
                        {review.author_details.rating}/10
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300 font-mono leading-relaxed">{review.content}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center italic">No reviews available.</p>
          )}
        </div>
      );
    }


    return (
      <div className="space-y-4">
        {currentRecommendation && (
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            {/* Conditionally show poster or trailer */}
            {showTrailer ? (
              <iframe
                className="w-full h-[200px]"
                src={`https://www.youtube.com/embed/${currentRecommendation.trailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                src={currentRecommendation.imageUrl}
                alt={currentRecommendation.title}
                className="w-full h-[200px] object-cover cursor-pointer"
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-bold text-sky-300">{currentRecommendation.title}</h3>
              <div className="mt-2 text-slate-300 text-sm space-y-1">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-slate-700 rounded-full">{currentRecommendation.year}</span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded-full flex justify-between">
                    <Star size={16} className="mr-1 mt-0.5" /> {currentRecommendation.rating}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded-full">{currentRecommendation.runtime}</span>
                </div>
              </div>
              <p className="text-slate-400 mt-2 text-sm line-clamp-3">{currentRecommendation.description}</p>

              <div className="flex justify-between mt-4 w-full">
                <button
                  onClick={() => addToWatchlist(currentRecommendation)}
                  className="flex gap-2 bg-sky-600 active:text-red-600 w-fit text-white px-2 py-1 rounded-full hover:bg-sky-700 transition"
                >
                  <Heart size={16} className="" /> Add to Watchlist
                </button>
                <button
                  onClick={fetchRecommendation}
                  className="flex items-center gap-2 bg-orange-600 text-white px-2 py-1 rounded-full hover:bg-orange-700"
                >
                  <RefreshCw size={16} /> New
                </button>
                {currentRecommendation.trailerKey && (
                  <button
                    onClick={() => setShowTrailer(!showTrailer)}
                    className="bg-red-600 text-white px-2 py-1 rounded-full hover:bg-green-700 transition"
                  >
                    {showTrailer ? "Close Trailer" : "▶ Play Trailer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {feedback && (
          <div
            className={`absolute bottom-1 left-1/2 transform font-bold -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg animate-fadeIn ${feedback.type === 'error' ? 'bg-red-600' : 'bg-green-600'
              } text-white`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    );
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'watchlist') fetchWatchlist();
    if (tabId === 'reviews' && !currentRecommendation) fetchRecommendation();
  };

  return (
    <div className="w-96 h-[500px] bg-slate-900 text-white p-6 rounded-xl shadow-2xl overflow-hidden">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-sky-400">AdFriend</h1>
        <div className="flex gap-2">
          {[
            { id: 'recommendations', icon: <Film size={20} /> },
            { id: 'watchlist', icon: <List size={20} /> },
            { id: 'reviews', icon: <Star size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-2 rounded-full transition ${activeTab === tab.id ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </header>
      {renderContent()}
    </div>
  );
};

export default Popup;
