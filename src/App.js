import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import Songs from './Components/Songs';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="songs" element={<Songs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
