import React, { useEffect, useState } from 'react';
import { Play, Sparkles, Shield, XCircle, Ban, Film, ArrowRight } from 'lucide-react';

const AnimatedAdBlock = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className={`transform transition-all duration-500 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
        <div className="relative">
          <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Ban className="w-8 h-8 text-red-500" />
          </div>
          <XCircle
            className="absolute -top-2 -right-2 w-6 h-6 text-red-500 animate-pulse"
          />
        </div>
      </div>

      <ArrowRight className={`w-8 h-8 text-purple-400 transform transition-all duration-500 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`} />

      <div className={`transform transition-all duration-500 ${!isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
        <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <Film className="w-8 h-8 text-purple-500" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const Newtab = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-orange-900">
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AdFriend</h1>
          {/* <button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
            Get Started
          </button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`max-w-7xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <h1 className="text-4xl mt-5 md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Block Ads,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Discover Movies
            </span>
          </h1>

          <AnimatedAdBlock />

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Every blocked ad becomes your next movie discovery.
            Smarter browsing, better recommendations.
          </p>

          {/* <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <button className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-full text-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105">
              <Shield className="w-5 h-5" />
              Install Now
              <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2.5 py-0.5 bg-pink-500 text-xs font-bold rounded-full transform group-hover:scale-110 transition-transform">
                Free
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-full text-lg font-semibold hover:bg-slate-700 transition-all transform hover:scale-105">
              See How It Works
            </button>
          </div> */}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Ban className="w-8 h-8 text-red-400" />,
                title: "Smart Ad Blocking",
                description: "Automatically detect and block intrusive ads"
              },
              {
                icon: <Film className="w-8 h-8 text-purple-400" />,
                title: "Movie Recommendations",
                description: "Get personalized suggestions based on your taste"
              },
              {
                icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
                title: "Instant Watchlist",
                description: "Save and organize your must-watch movies"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800 bg-opacity-50 rounded-2xl backdrop-blur-lg transform transition-all hover:scale-105"
              >
                <div className="p-3 bg-slate-700 rounded-xl w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Newtab;