// UserMenu.jsx
import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';
import { useAuth } from '../AuthProvider/AuthProvider';

const USER_MENU_EP = `${BACKEND_URL}/user_menu`;


function UserMenu() {
    // const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const { logOut, userId } = useAuth()

    useEffect(() => {
        const fetchUserMenu = async () => {
            try {
                const response = await axios.get(`${USER_MENU_EP}/${JSON.parse(JSON.stringify(userId))}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user menu:', error);
            }
        };

        fetchUserMenu();
    }, [JSON.parse(JSON.stringify(userId))]);
    

  if (!userData) {
    return <div>Loading...</div>;
  }

  // const logOut=()=>{
  //   window.localStorage.clear();
  //   window.location.href = "/sign_in";
  // }

  return (
    <div>
          <div className="userHome_title">Welcome, User {userData.name}</div>
      <ul>
        <li>Email: {userData.email}</li>
        <li>Playlist: {userData.playlists}</li>
          <ul>
            {userData.playlists.map((playlist, index) => (
              <li key={index}>{playlist}</li>
            ))}
          </ul>
      </ul>
      <button type="submit" onClick={logOut}>Log Out</button>
    </div>
  );
}

export default UserMenu;
