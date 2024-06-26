// UserMenu.jsx
import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';
import './UserHome.css';
import { useAuth } from '../AuthProvider/AuthProvider';

const USER_MENU_EP = `${BACKEND_URL}/user_menu`;


function UserMenu() {
    const [userData, setUserData] = useState(null);
    const { logOut, user_id } = useAuth()

    useEffect(() => {
        const fetchUserMenu = async () => {
            try {
                const response = await axios.get(`${USER_MENU_EP}/${user_id}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user menu:', error);
            }
        };

        fetchUserMenu();
    }, [user_id]);
    

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
          <div className="userHome-title">Welcome, {userData.name}</div>
      <ul>
        <li>Email: {userData.email}</li>
      </ul>
      <div className="log-out-button">
        <button type="submit" onClick={logOut}>Log Out</button>
      </div>

    </div>
  );
}

export default UserMenu;
