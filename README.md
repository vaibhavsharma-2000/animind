# 🔴 ANIMIND: AI-Powered Anime Discovery
A next-generation discovery platform that bridges the gap between Human Engineering and Artificial Intelligence.

Conceptually designed as a "Letterboxd for Anime," AniMind goes beyond standard databases by integrating Google Gemini 2.5 Flash to "see" and analyze anime art styles. This project is a fusion of my personal knowledge in JavaScript, React, and System Architecture with the raw generative power of AI—creating a seamless experience where users can discover content based on visual "vibes" rather than just text tags.

Built With: React 18, Vite, Tailwind CSS, Framer Motion, Google Generative AI, AniList GraphQL.

Built with a high-fidelity Cyberpunk aesthetic, it leverages the AniList API for real-time data and Local Storage for a frictionless, login-free user experience.

🔗 [Live Demo on Vercel](https://animind-v2.vercel.app/)

## ✨ Key Features

### 👁️ "Vision" Search (AI-Powered)
The crown jewel of AniMind. Users can upload a screenshot, fan art, or any image. The app sends the image to Gemini 1.5 Flash, which analyzes the color palette, art style, and atmosphere to recommend 5 similar anime titles.

Tech: Gemini Multimodal API + AniList GraphQL.

### 🧠 Smart Autocomplete
A "Web 3.0" search bar that predicts what you are looking for.

Debounced Input: Prevents API spam by waiting for the user to stop typing.

Visual Dropdown: Displays micro-cards (Poster + Year + Format) instantly.

Search History: Remembers your last 5 searches using Local Storage.

### 📂 The "Data Dossier" (Details Page)
A rich, immersive detail view designed like a futuristic system interface.

Dynamic Routing: URL-based routing (/anime/:id) allows for easy sharing.

Visual Recommendations: Uses AniList's recommendation engine to populate a "Vibe Match" section.

Stats Grid: Displays score, studio, episodes, and status in a clean grid.

### 🍱 Expanding Genre Grid
A "Bento Box" style interactive grid for browsing categories.

CSS Grid Spanning: Clicking a genre expands the card to fill the row, revealing top anime in that category without leaving the page.

### 💾 Frictionless Library & Profile
No Login Required: Uses persistent Local Storage to create a "Guest Profile."

Library: Users can add anime to their "Watching" or "Completed" lists.

Profile: Tracks user stats and recent activity automatically.

## 🛠️ Tech Stack
Frontend Framework: React (Vite) for blazing fast performance.

Styling: Tailwind CSS (Custom color config for the Neon Red/Dark theme).

AI Model: Google Gemini 2.5 Flash (via Google Generative AI SDK).

Data API: AniList GraphQL API.

Routing: React Router DOM v6.

Icons: Lucide React.

Deployment: Vercel.

## 🏗️ System Architecture
AniMind uses a Hybrid API Approach to get the best of both worlds: Intelligence and Accuracy.

The Brain (Gemini): Used for fuzzy logic, natural language understanding, and image analysis. It returns raw string data (e.g., "Cyberpunk Edgerunners, Akira").

The Database (AniList): The app takes the strings from Gemini and queries AniList to get the "Hard Data" (Posters, ID, Synopsis, Ratings).

The Memory (Local Storage): Saves user preferences and library data directly in the browser.

Code snippet

graph TD;
    User-->|Uploads Image| UI;
    UI-->|Sends Image| GeminiAPI;
    GeminiAPI-->|Returns Titles| UI;
    UI-->|Queries Titles| AniListAPI;
    AniListAPI-->|Returns Metadata| UI;
    UI-->|Renders Cards| User;

## 🚀 Getting Started Locally
Follow these steps to run the "Neural Network" on your local machine.

### 1. Clone the Repository
Bash

git clone https://github.com/vaibhavsharma-2000/animind.git
cd animind
### 2. Install Dependencies
Bash

npm install
### 3. Configure Environment Keys
Create a .env file in the root directory. You will need a Google Gemini API Key (Free tier available at Google AI Studio).

Code snippet

VITE_GEMINI_API_KEY=your_actual_api_key_here
### 4. Run the Development Server
Bash

npm run dev
Open http://localhost:5173 to view the app.

## 🛡️ Security Note
This project uses client-side API calls. The API Key is stored in .env and injected via Vite. For production, the key is secured via Vercel Environment Variables to ensure it is not exposed in the public repository.

## 🔮 Future Roadmap
[ ] Voice Search: allowing users to ask for recommendations verbally.

[ ] Trailer Integration: Embedding YouTube trailers in the Data Dossier.


## 🤝 Contact
Created by Vaibhav Sharma - Frontend Developer + UX Designer + AI Enthusiast

[LinkedIn](https://www.linkedin.com/in/vaibhavsharma2000/) | [Portfolio Github](https://github.com/vaibhavsharma-2000) | [Portfolio Behance](https://www.behance.net/vaibhavsharma2000)