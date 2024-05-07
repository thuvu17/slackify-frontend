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
import Playlists from './Components/Playlists/Playlists';
import Playlist from './Components/Playlist/Playlist';
import UserMenu from './Components/UserHome/UserHome';
import SignIn from './Components/SignIn';
import CreateAccount from './Components/CreateAccount'
import AuthProvider from "./Components/AuthProvider";
import PrivateRoute from "./Components/PrivateRoute";

function App() {

  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
          <Routes>
            <Route path="" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="songs" element={<Songs />} />
              <Route path="users" element={<Users />} />
              <Route path="user_menu/:user_id" element={<UserMenu />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlist/:user_id/:name" element={<Playlist />} />
            </Route>
            <Route path="sign_in" element={<SignIn />} />
            <Route path="create_account" element={<CreateAccount />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
