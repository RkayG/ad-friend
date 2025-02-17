# AdFriend Extension 🎬

![AdFriend Banner](/public/images/adfriend-demo.png)

AdFriend transforms intrusive web advertisements into personalized movie recommendations. Rather than being distracted by ads, discover your next favorite movie while browsing!

## ✨ Features

### Ad Replacement
- **Smart Detection**: Automatically identifies and replaces ad containers
- **Movie Reviews**: Shows authentic user reviews in place of ads
- **Interactive Interface**: Each recommendation includes:
  - Movie information
  - User ratings
  - Quick action buttons
  - Trailer preview
  - Watchlist management

![Ad Replacement Demo](/public/images/ad-replace-demo.png)

### Interactive Movie Cards
- **Quick Actions**:
  - ▶️ Watch trailer
  - ℹ️ View movie details
  - ❤️ Add to watchlist
- **Review System**:
  - Read user reviews
  - Rating distribution
  - Critic scores

![Movie Card Features](/public/images/movie-card-features.png)

### Extension Popup
The popup interface provides quick access to:
- **Movie Recommendations**: Browse curated suggestions
- **Watchlist Management**: Keep track of movies you want to watch
- **Review Browser**: Read detailed movie reviews
- **Trailer Player**: Watch trailers directly in the popup

![Popup Interface](/public/images/popup.png)

## 🚀 Installation and Running 

1. Clone the repository
2. run `npm install` to install dependencies
3. Get TMDB API key and store it in the TMDB_API_KEY variable in the Background/index.js file
```bash
TMDB_API_KEY = "Your-Api-key"
```
5. run in dev mode with `npm run start`. This will generate a build folder in the root directory
6. Load extension by:
  - i. Go to chrome extensions and toggle developer mode
  - ii. Select 'load unpacked' and select the build folder from its location
  - iii. Visit any ad-prone website to test the extension

## 🎯 How It Works

1. **Ad Detection**: AdFriend identifies common ad containers on web pages
2. **Replacement**: Ads are replaced with personalized movie recommendations
3. **Interaction**: Click on any movie card to:
   - Watch trailers
   - Read reviews
   - Add to your watchlist
   - Get more information

## 🛠️ Technical Features

- Real-time ad detection and replacement
- Seamless integration with TMDb API
- Chrome Storage Sync for cross-device watchlist
- Responsive design adapting to various ad container sizes
- Memory-efficient content script

## 🎨 User Interface

### Movie Cards
- Clean, modern design
- Smooth animations
- Intuitive controls
- Rich movie information

### Popup
- Three main sections:
  1. Recommendations
  2. Watchlist
  3. Reviews
- Easy navigation
- Quick actions

## 🔒 Privacy

- No personal data collection
- No tracking
- Local storage only
- Transparent operation

## 📱 Screenshots

### Ad Replacement
![Ad Replacement](/public/images/movie-card-trailer.png)

### Movie Details
![Movie Trailer](/public/images/trailer.png)

### Watchlist Management
![Watchlist](/public/images/watchlist.png)


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TMDb for movie data
- Starter template used for the extension -> https://github.com/lxieyang/chrome-extension-boilerplate-react

## 💡 Feedback

Have suggestions or found a bug? Please open an issue!

