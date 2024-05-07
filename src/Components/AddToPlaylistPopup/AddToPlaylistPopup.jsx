import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import { useAuth } from '../AuthProvider/AuthProvider';
// for pop-up window
import Popup from 'reactjs-popup';
import Select from "react-dropdown-select";

const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const GET_PLAYLIST_EP = `${PLAYLISTS_EP}/get`;
const PLAYLIST_EP = `${BACKEND_URL}/playlist`;
const UPDATE_PLAYLIST_EP = `${PLAYLIST_EP}/Update`;
const PLAYLIST_URL = '/playlist';

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

function PlaylistsObjectToArray({ Data }) {
  const keys = Object.keys(Data);
  const Playlists = keys.map((key) => Data[key]);
  return Playlists;
}

AddToPlaylistPopup.propTypes = {
  name: propTypes.string.isRequired,
  artist: propTypes.string.isRequired,
  song_id: propTypes.string.isRequired,
};

function AddToPlaylistPopup({
  name,
  artist,
  song_id,
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
    setError('');
  };
  const { user_id } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const navigate = useNavigate();

  const fetchPlaylists = (user_id) => {
    axios.get(`${GET_PLAYLIST_EP}/${user_id}`)
      .then(({ data }) => setPlaylists(PlaylistsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of playlists.'));
  };

  const addtoPlaylist = (event) => {
    event.preventDefault();
    axios.put(`${UPDATE_PLAYLIST_EP}/${user_id}/${playlistName}/${song_id}`)
        .then(() => {
          navigate(`${PLAYLIST_URL}/${user_id}/${playlistName}`, {replace: true});
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
          
  };

  return (
    <div>
      <button type="button" className="button" onClick={() => {setOpen(o => !o); fetchPlaylists(user_id)}}>
        Add to Playlist
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <div className="close">
            <a  onClick={closeModal}>
            &times;</a>
          </div>

          <div className='popup-text'>
            <h3>Add the Song to Playlist</h3>
            <p><strong>Song Name:</strong> {name}</p>
            <p><strong>Song Artist:</strong> {artist}</p>
            <div className='playlist-name-selector'>
              <p><strong>Playlist Name:</strong></p>
              <Select
                options={playlists}
                labelField="name"
                valueField="name"
                onChange={(value) => {
                  setPlaylistName(value[0].name);
                  setError('');
                }}
              />
            </div>
          </div>
          {error && <ErrorMessage message={error} />}
        <div className='popup-buttons'>
          <button type="submit" onClick={addtoPlaylist}>Submit</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
        </div>

      </Popup>
    </div>
  );
}

export default AddToPlaylistPopup;