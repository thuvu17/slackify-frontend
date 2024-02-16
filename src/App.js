import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import './App.css';
// import { Helmet } from "react-helmet";

import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import Users from './Components/Users';

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="songs" element={<Songs />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
