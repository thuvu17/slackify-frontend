import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const SONGS_EP = `${BACKEND_URL}/songs`;


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


function Songs() {
    const [songs, set_songs] = useState([]);
    const [error, set_error] = useState('');
    
    useEffect(
        () => {
            axios.get(SONGS_EP)
                .then((response) => {
                    const songs_object = response.data.Data;
                    const keys = Object.keys(songs_object);
                    const songs_array = keys.map((key) => songs_object[key]);
                    set_songs(songs_array);
                })
                .then()
                .catch((error) => { 
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        console.error('Server Error:', error.response.data);
                        set_error('Server Error: ' + error.response.data.message); // Assuming the server sends error messages in a 'message' field
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.error('Network Error:', error.request);
                        set_error('Network Error: No response from server');
                    } else {
                        // Something else happened while setting up the request
                        console.error('Request Error:', error.message);
                        set_error('Request Error: ' + error.message);
                    }
                });
                
        },
        [],
    );

    return (
    <div className="wrapper">
        <h1>View All Songs</h1>
        {error && <ErrorMessage message={error} />}
        {songs.map((song) => (
            <div className='song-container' key={song._id}>
                <h2>{song.name}</h2>
                <p>Aritst: {song.artist}</p>
                <p>Album: {song.album}</p>
                <p>Genre: {song.genre}</p>
                <p>BPM: {song.bpm}</p>
            </div>
        ))}
    </div>
    );
}

export default Songs;
