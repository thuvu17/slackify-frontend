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
// import Playlists from './Components/Playlists';
import UserMenu from './Components/UserHome/UserHome';
import SignIn from './Components/SignIn';
import CreateAccount from './Components/CreateAccount'
import AuthProvider from "./Components/AuthProvider";
import PrivateRoute from "./Components/PrivateRoute";
// import Form from './Components/Form';

function App() {
  // const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <>
    <BrowserRouter>
      <Navbar />
        <AuthProvider>
          <Routes>
            <Route path="" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="songs" element={<Songs />} />
              <Route path="users" element={<Users />} />
              {/* <Route path="playlists" element={<Playlists />} /> */}
            </Route>
            <Route path="sign_in" element={<SignIn />} />
            <Route path="user_menu/:userId" element={<UserMenu />} />
            <Route path="create_account" element={<CreateAccount />} />
          </Routes>
        </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
