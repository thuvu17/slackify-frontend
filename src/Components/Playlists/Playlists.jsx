import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import { useAuth } from '../AuthProvider/AuthProvider';

const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const GET_PLAYLIST_EP = `${PLAYLISTS_EP}/get`;
const DEL_PLAYLIST_EP = `${PLAYLISTS_EP}/delete`;

const PLAYLIST_URL = '/playlist';


function AddPlaylistForm({
  visible,
  cancel,
  fetchPlaylists,
  setError,
  setSuccessMsg,
}) {
  const [name, setName] = useState('');
  const { user_id } = useAuth();
  const changeName = (event) => { setName(event.target.value); };

  const addPlaylist = (event) => {
    event.preventDefault();
    axios.post(PLAYLISTS_EP, { user_id, name })
      .then(() => {
        setSuccessMsg(`Successfully created playlist ${name}`);
        // Reset form fields
        setName('');
        fetchPlaylists(user_id);
        }
      )
      .catch(error => {
        if (error.response) {
          // console.error(error.response.data);
          setError(error.response.data.message);
        }
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">Playlist name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addPlaylist}>Submit</button>

    </form>
  );
}
AddPlaylistForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPlaylists: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  addPlaylistResult: propTypes.string,
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
  const [successMsg, setSuccessMsg] = useState('');
  const [addingPlaylist, setAddingPlaylist] = useState(false);
  const showAddPlaylistForm = () => { setAddingPlaylist(true); };
  const hideAddPlaylistForm = () => { setAddingPlaylist(false); };
  const { user_id } = useAuth();
  const navigate = useNavigate();
   
  const fetchPlaylists = (user_id) => {
    axios.get(`${GET_PLAYLIST_EP}/${user_id}`)
      .then(({ data }) => setPlaylists(PlaylistsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of playlists.'));
  };

  const delPlaylist = (user_id, name) => {
    axios.delete(`${DEL_PLAYLIST_EP}/${user_id}/${name}`)
    .then(() => {
      setSuccessMsg(`Successfully deleted playlist ${name}`);
      // Refresh playlists after deletion
      fetchPlaylists(user_id);
    }
    )
    .catch(() => {
      setError('There was a problem deleting the playlist.');
    });
  }

  const viewPlaylist = (user_id, name) => {
    navigate(`${PLAYLIST_URL}/${user_id}/${name}`, {replace: true});
  }

  useEffect(
      () => {
          axios.get(`${GET_PLAYLIST_EP}/${user_id}`)
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
      setSuccessMsg={setSuccessMsg}
    />
      {error && <ErrorMessage message={error} />}
      {successMsg && <ErrorMessage message={successMsg} />}
          {playlists.map((playlist) => (
            <div className='playlist-container' key={playlist.name} onClick={() => viewPlaylist(user_id, playlist.name)}>
              <h2>{playlist.name}</h2>
              <p>Date Created: {playlist.date_created}</p>
              <button className="del_button" onClick={() => delPlaylist(user_id, playlist.name)}>Delete</button>
            </div>
    ))}
    
  </div>
  );
}

export default Playlists;