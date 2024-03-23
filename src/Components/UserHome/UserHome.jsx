// UserMenu.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';

const USER_MENU_EP = `${BACKEND_URL}user_menu`;


function UserMenu() {
    const { userId } = useParams();
    console.log(userId)
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserMenu = async () => {
            try {
                const response = await axios.get(`${USER_MENU_EP}/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user menu:', error);
            }
        };

        fetchUserMenu();
    }, [userId]);
    

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
          <h1>Welcome, User {userData.name}</h1>
      <ul>
        <li>Email: {userData.email}</li>
        <li>Playlist: {userData.playlists}</li>
        {/* Other user menu content */}
      </ul>
    </div>
  );
}

export default UserMenu;
