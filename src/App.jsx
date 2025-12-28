import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
// We haven't created this yet, but we will in a second
import Discover from './components/Discover';
import Library from './components/Library';
import AnimeDetail from './components/AnimeDetail';
import Profile from './components/Profile';
import Genres from './components/Genres';
import GenreView from './components/GenreView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1: The Home Page (Default) */}
        <Route path="/" element={<Home />} />

        {/* Route 2: Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* Route 3: Discover Page */}
        <Route path="/discover" element={<Discover />} />

        {/* Route 4: Genres Page */}
        <Route path="/genres" element={<Genres />} />
        <Route path="/genre/:genre" element={<GenreView />} />

        {/* Route 3: Library Page */}
        <Route path="/library" element={<Library />} />

        {/* Route 4: The Detail Page */}
        <Route path="/anime/:id" element={<AnimeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;