import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';

const USER_MENU_URL = '/user_menu';

const USER_PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'View All Songs', destination: '/songs' },
  { label: 'View All Playlists', destination: '/playlists' },
];

const ADMIN_PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'View All Songs', destination: '/songs' },
  { label: 'View All Playlists', destination: '/playlists' },
  { label: 'View All Users', destination: '/users' },
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
  const { isLoggedIn, user_id, isAdmin } = useAuth()
  const pagesToRender = isLoggedIn ? isAdmin? ADMIN_PAGES : USER_PAGES : LOGGEDOUT_PAGES;

  if (!isAdmin && isLoggedIn && (!USER_PAGES.some((page) => (page.label === 'Profile'))) ) {
    pagesToRender.push({ label: 'Profile', destination: `${USER_MENU_URL}/${user_id}` });
  }

  if (isAdmin && isLoggedIn && (!ADMIN_PAGES.some((page) => (page.label === 'Profile'))) ) {
    pagesToRender.push({ label: 'Profile', destination: `${USER_MENU_URL}/${user_id}` });
  }

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
