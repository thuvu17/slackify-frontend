import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const GET_PLAYLIST_EP = `${PLAYLISTS_EP}/get`;


function AddPlaylistForm({
  visible,
  cancel,
  fetchPlaylists,
  setError,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [song, setSong] = useState([]);
  const [addPlaylistResult, setAddPlaylistResult] = useState('');

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeSong = (event) => { setSong(event.target.value); };
  const changeSucessMsg = () => { setAddPlaylistResult(`${song} listened by ${email} has been added to the database`); };
  const changeFailMsg = () => { setAddPlaylistResult('There was a problem adding the playlist.'); };

  const addPlaylist = (event) => {
    event.preventDefault();
    axios.post(PLAYLISTS_EP, { name, email, song })
      .then(
        changeSucessMsg(),
        // Reset form fields
        setName(''),
        setEmail(''),
        setSong(''),
        fetchPlaylists,
      )
      .catch(() => {
        setError('There was a problem adding the playlist.');
        changeFailMsg();
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">Song name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="email">Email</label>
      <input required type="text" id="email" value={email} onChange={changeEmail} />

      <label htmlFor="password">Song</label>
      <input required type="text" id="song" value={song} onChange={changeSong} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addPlaylist}>Submit</button>

      <div className='add-playlist-result'>
        <td>{ addPlaylistResult }</td>
      </div>

    </form>
  );
}
AddPlaylistForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPlaylists: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  addPlaylistResult: propTypes.string.isRequired,
};


function PlaylistsObjectToArray({ Data }) {
  const keys = Object.keys(Data);
  const Playlists = keys.map((key) => Data[key]);
  return Playlists;
}


function ErrorMessage({ message }) {
    return (
      <div className="error-message">
        {message}
      </div>
    );
  }
  ErrorMessage.propTypes = {
    message: propTypes.string.isRequired,
  };


function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [addingPlaylist, setAddingPlaylist] = useState(false);
  const showAddPlaylistForm = () => { setAddingPlaylist(true); };
  const hideAddPlaylistForm = () => { setAddingPlaylist(false); };
   
  const fetchPlaylists = (email) => {
    axios.get(GET_PLAYLIST_EP/{email})
      .then(({ data }) => setPlaylists(PlaylistsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of playlists.'));
  };

  useEffect(
      () => {
          axios.get(PLAYLISTS_EP)
              .then((response) => {
                  setPlaylists(PlaylistsObjectToArray(response.data));
              })
              .then()
              .catch((error) => { 
                  if (error.response) {
                      // The request was made and the server responded with a status code
                      console.error('Server Error:', error.response.data);
                      setError('Server Error: ' + error.response.data.message); // Assuming the server sends error messages in a 'message' field
                  } else if (error.request) {
                      // The request was made but no response was received
                      console.error('Network Error:', error.request);
                      setError('Network Error: No response from server');
                  } else {
                      // Something else happened while setting up the request
                      console.error('Request Error:', error.message);
                      setError('Request Error: ' + error.message);
                  }
              });
              
      },
      [],
  );

  return (
  <div className="wrapper">
    <h1>View All Playlists</h1>
    <button type="button" onClick={showAddPlaylistForm}>
      Add a Playlist
    </button>
    <AddPlaylistForm
      visible={addingPlaylist}
      cancel={hideAddPlaylistForm}
      fetchPlaylists={fetchPlaylists}
      setError={setError}
    />
          {playlists.map((playlist) => (
              <div className='playlist-container' key={playlist._id}>
        <h2>{playlist.name}</h2>
          <p>Email: {playlist.email}</p>
          <p>Song: {playlist.song}</p>
      </div>
    ))}
    {error && <ErrorMessage message={error} />}
  </div>
  );
}

export default Playlists;