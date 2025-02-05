import React, { useState, useEffect } from 'react';
import { Film, List, Settings, RefreshCw, Heart } from 'lucide-react';

const Popup = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [recommendationCategory, setRecommendationCategory] = useState('action');
  const [watchlist, setWatchlist] = useState([]);
  const [newWatchlistItem, setNewWatchlistItem] = useState('');
  const [settings, setSettings] = useState({
    darkMode: true,
    preferredGenres: ['action', 'comedy'],
    streamingPlatforms: ['Netflix', 'Hulu']
  });

  // Enhanced recommendations with more metadata and image URLs
  const recommendations = {
    action: [
      {
        title: "Mad Max: Fury Road",
        year: 2015,
        rating: "R",
        runtime: "120 min",
        imageUrl: "/api/placeholder/300/450", // Placeholder for demo
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland."
      },
      {
        title: "John Wick",
        year: 2014,
        rating: "R",
        runtime: "101 min",
        imageUrl: "/api/placeholder/300/450",
        description: "An ex-hitman comes out of retirement to track down the gangsters who killed his dog."
      },
      {
        title: "The Dark Knight",
        year: 2008,
        rating: "PG-13",
        runtime: "152 min",
        imageUrl: "/api/placeholder/300/450",
        description: "Batman faces his greatest challenge as the Joker wreaks havoc on Gotham City."
      }
    ],
    comedy: [
      {
        title: "Superbad",
        year: 2007,
        rating: "R",
        runtime: "113 min",
        imageUrl: "/api/placeholder/300/450",
        description: "Two high school friends try to make the most of their final days before graduation."
      }
      // ... other comedy movies
    ],
    sciFi: [
      {
        title: "Inception",
        year: 2010,
        rating: "PG-13",
        runtime: "148 min",
        imageUrl: "/api/placeholder/300/450",
        description: "A thief who enters the dreams of others to steal secrets from their subconscious."
      }
      // ... other sci-fi movies
    ]
  };

  useEffect(() => {
    const loadSavedData = async () => {
      if (chrome?.storage?.local) {
        const data = await chrome.storage.local.get([
          'watchlist',
          'settings',
          'lastRecommendation'
        ]);

        if (data.watchlist) setWatchlist(data.watchlist);
        if (data.settings) setSettings(data.settings);
        if (data.lastRecommendation) setCurrentRecommendation(data.lastRecommendation);
        else generateNewRecommendation('action');
      }
    };
    loadSavedData();
  }, []);

  const generateNewRecommendation = (category) => {
    const categoryRecommendations = recommendations[category];
    const randomMovie = categoryRecommendations[Math.floor(Math.random() * categoryRecommendations.length)];
    setCurrentRecommendation(randomMovie);
    setRecommendationCategory(category);
  };

  const addToWatchlist = (movie) => {
    const newItem = {
      id: Date.now().toString(),
      ...movie
    };
    setWatchlist(prev => [...prev, newItem]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <div className="space-y-4">
            {currentRecommendation && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-[200px] aspect-[2/3] w-full">
                  <img
                    src={currentRecommendation.imageUrl}
                    alt={currentRecommendation.title}
                    className="w-full h-full object-cover"
                  />
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
                    <button
                      onClick={() => addToWatchlist(currentRecommendation)}
                      className="flex items-center gap-2 bg-sky-600 text-white px-3 py-1 rounded-full hover:bg-sky-700 transition"
                    >
                      <Heart size={16} />
                      Add to Watchlist
                    </button>
                    <button
                      onClick={() => generateNewRecommendation(recommendationCategory)}
                      className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full hover:bg-orange-700 transition"
                    >
                      <RefreshCw size={16} />
                      New
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(recommendations).map(genre => (
                <button
                  key={genre}
                  onClick={() => generateNewRecommendation(genre)}
                  className={`p-2 rounded-lg transition ${recommendationCategory === genre
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-slate-900 text-white p-6 rounded-xl shadow-2xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-400">MovieMate</h1>
        <div className="flex gap-2">
          {[
            { id: 'recommendations', icon: <Film size={20} /> },
            { id: 'watchlist', icon: <List size={20} /> },
            { id: 'settings', icon: <Settings size={20} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-full transition ${activeTab === tab.id
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
                }`}
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