// UserMenu.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';

const USER_MENU_EP = `${BACKEND_URL}/user_menu`;


function UserMenu() {
    const { userId } = useParams();
    var [userData, setUserData] = useState(null);

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
      <h1>Welcome, User {userId}</h1>
      <ul>
        <li>Name: {userData.name}</li>
        <li>Email: {userData.email}</li>
        {/* Other user menu content */}
      </ul>
    </div>
  );
}

export default UserMenu;
