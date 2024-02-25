import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import './App.css';
// import { Helmet } from "react-helmet";

import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import Users from './Components/Users';
import Playlists from './Components/Playlists';
import SignIn from './Components/SignIn';

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="songs" element={<Songs />} />
          <Route path="users" element={<Users />} />
          {/* <Route path="playlists" element={<Playlists />} /> */}
          <Route path="sign_in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
