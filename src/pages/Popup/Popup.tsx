// Popup/Popup.tsx
import React, { useState, useEffect } from 'react';
import { Film, List, Settings, RefreshCw, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const Popup = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [recommendationCategory, setRecommendationCategory] = useState('action');
  const [watchlist, setWatchlist] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [settings, setSettings] = useState({
    darkMode: true,
    preferredGenres: ['action', 'comedy'],
    streamingPlatforms: ['Netflix', 'Hulu']
  });

  const genres = [
    { id: 'action', name: 'Action', color: 'bg-blue-500' },
    { id: 'comedy', name: 'Comedy', color: 'bg-yellow-500' },
    { id: 'scifi', name: 'Sci-Fi', color: 'bg-red-500' },
    { id: 'drama', name: 'Drama', color: 'bg-purple-500' },
    { id: 'horror', name: 'Horror', color: 'bg-slate-700' },
    { id: 'romance', name: 'Romance', color: 'bg-pink-500' },
    { id: 'thriller', name: 'Thriller', color: 'bg-green-500' },
    { id: 'fantasy', name: 'Fantasy', color: 'bg-indigo-500' },
    { id: 'mystery', name: 'Mystery', color: 'bg-orange-500' },
    { id: 'animation', name: 'Animation', color: 'bg-cyan-500' },
    { id: 'adventure', name: 'Adventure', color: 'bg-amber-500' },
    { id: 'crime', name: 'Crime', color: 'bg-emerald-500' }
  ];

  const scroll = (direction) => {
    const container = document.getElementById('genre-container');
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });
    port.postMessage({ greeting: "hello" });

    chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATION' }, (response) => {
      if (response?.recommendation) {
        setCurrentRecommendation(response.recommendation);
      }
      console.log("Blocked Ads Count:", response.count);
    });
  }, []);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => [...prev, { id: Date.now().toString(), ...movie }]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <div className="space-y-4">
            {currentRecommendation && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-[2/3] h-[200px] w-full">
                  <img src={currentRecommendation.imageUrl} alt={currentRecommendation.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-sky-300">{currentRecommendation.title}</h3>
                  <div className="mt-2 text-slate-300 text-sm space-y-1">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-slate-700 rounded-full">{currentRecommendation.year}</span>
                      <span className="px-2 py-0.5 bg-slate-700 rounded-full">{currentRecommendation.rating}</span>
                      <span className="px-2 py-0.5 bg-slate-700 rounded-full">{currentRecommendation.runtime}</span>
                    </div>
                    <p className="mt-2 text-slate-400 line-clamp-2">{currentRecommendation.description}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button onClick={() => addToWatchlist(currentRecommendation)} className="flex items-center gap-2 bg-sky-600 text-white px-3 py-1 rounded-full hover:bg-sky-700 transition">
                      <Heart size={16} /> Add to Watchlist
                    </button>
                    <button onClick={() => {
                      chrome.runtime.sendMessage({ type: 'GET_RECOMMENDATION' }, (response) => {
                        if (response?.recommendation) {
                          setCurrentRecommendation(response.recommendation);
                        }
                      });
                    }} className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full hover:bg-orange-700 transition">
                      <RefreshCw size={16} /> New
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="relative">
              <button onClick={() => scroll('left')} className="absolute z-50 left-0 top-1/2 transform -translate-y-1/2 p-1 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors disabled:opacity-50" disabled={scrollPosition === 0}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div id="genre-container" className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 pb-2 px-8">
                {genres.map((genre) => (
                  <button key={genre.id} onClick={() => setRecommendationCategory(genre.id)} className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all transform ${recommendationCategory === genre.id ? `${genre.color} text-white scale-105` : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>{genre.name}</button>
                ))}
              </div>
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-slate-900 text-white p-6 rounded-xl shadow-2xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-400">MovieMate</h1>
        <div className="flex gap-2">
          {[{ id: 'recommendations', icon: <Film size={20} /> }, { id: 'watchlist', icon: <List size={20} /> }, { id: 'settings', icon: <Settings size={20} /> }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-2 rounded-full transition ${activeTab === tab.id ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>{tab.icon}</button>
          ))}
        </div>
      </header>
      {renderContent()}
    </div>
  );
};

export default Popup;