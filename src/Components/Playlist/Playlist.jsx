import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const PLAYLIST_EP = `${BACKEND_URL}/playlist`;
const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const DEL_PLAYLIST_EP = `${PLAYLISTS_EP}/delete`;
const PLAYLISTS_URL = '/playlists';

function SongsObjectToArray(Data) {
  const keys = Object.keys(Data);
  const Songs = keys.map((key) => Data[key]);
  return Songs;
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


function Playlist() {
  const [songs, setSongs] = useState([]);
  const [thisName, setName] = useState('');
  const [thisDate, setDate] = useState('');
  const [error, setError] = useState('');
  const { user_id, name } = useParams();
  const navigate = useNavigate();
   
  useEffect(
    () => {
        axios.get(`${PLAYLIST_EP}/${user_id}/${name}`)
            .then((response) => {
                setName(response.data.Data.name);
                setDate(response.data.Data.date_created);
                setSongs(SongsObjectToArray(response.data.Data.songs));
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

  const handleReturn = () => {
    navigate(`${PLAYLISTS_URL}`);
  };


  const delPlaylist = (user_id, name) => {
    axios.delete(`${DEL_PLAYLIST_EP}/${user_id}/${name}`)
    .then(() => {
      navigate(`${PLAYLISTS_URL}`);
    }
    )
    .catch(() => {
      setError('There was a problem deleting the playlist.');
    });
  }
  
  return (
  <div className="wrapper">
    <div><button className='return-button' onClick={handleReturn}>	&lt; Return</button></div>
    <h1>{thisName}</h1>
    <div className='playlist-header'>
      <h3>Date Created: {thisDate}</h3>
      <button className="del-button" onClick={() => delPlaylist(user_id, thisName)}>Delete</button>
    </div>

    
    {songs.length === 0 ? (
      <p>No songs found in this playlist.</p>
    ):(
      songs.map((song) => (
        <div className='playlist-song-container' key={song._id}>
          <h2>{song.name}</h2>
            <p>Aritst: {song.artist}</p>
            <p>Album: {song.album}</p>
            <p>Energy: {song.energy}</p>
            <p>BPM: {song.bpm}</p>
      </div>
    ))
  )}
    {error && <ErrorMessage message={error} />}
    
  </div>
  );
}

export default Playlist;