import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'View All Songs', destination: '/songs' },
  { label: 'View All Users', destination: '/users' },
  // { label: 'View All Playlists', destination: '/playlists' },
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
  return (
    <>
    <nav>
      <div className='title'>Slackify</div>
      <ul className="wrapper">
        {PAGES.map((page) => <NavLink key={page.destination} page={page} />)}
      </ul>
    </nav>
    </>
  );
}

export default Navbar;
