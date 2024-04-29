import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';

const USER_MENU_URL = '/user_menu';

const LOGGEDIN_PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'View All Songs', destination: '/songs' },
  { label: 'View All Users', destination: '/users' },
  //  { label: 'View Form', destination: '/form' },
  { label: 'View All Playlists', destination: '/playlists' },
];

const LOGGEDOUT_PAGES = [
    { label: 'Home', destination: '/' },
    { label: 'Sign In', destination: '/sign_in' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}

NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar() {
  const { isLoggedIn, user_id } = useAuth()

  if (isLoggedIn && !LOGGEDIN_PAGES.some((page) => (page.label === 'Profile'))) {
    LOGGEDIN_PAGES.push({ label: 'Profile', destination: `${USER_MENU_URL}/${user_id}` });
  }

  const pagesToRender = isLoggedIn ? LOGGEDIN_PAGES : LOGGEDOUT_PAGES

    return (
      <>
      <nav>
        <div className='title'>Slackify</div>
        <ul className="wrapper">
          {pagesToRender.map((page) => <NavLink key={page.destination} page={page}/>)}
        </ul>
      </nav>
      </>
    )

}

export default Navbar;
