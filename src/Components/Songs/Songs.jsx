import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const SONGS_EP = `${BACKEND_URL}/songs`;


function AddSongForm({
  visible,
  cancel,
  fetchSongs,
  set_error,
}) {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [bpm, setBPM] = useState(0);

  const changeName = (event) => { setName(event.target.value); };
  const changeArtist = (event) => { setArtist(event.target.value); };
  const changeAlbum = (event) => { setAlbum(event.target.value); };
  const changeGenre = (event) => { setGenre(event.target.value); };
  const changeBPM = (event) => { setBPM(event.target.value); };

  const addSong = (event) => {
    event.preventDefault();
    axios.post(SONGS_EP, {
      "name": name,
      "artist": artist,
      "album": album,
      "genre": genre,
      "bpm": bpm,
    })
      .then(fetchSongs)
      .catch(() => { set_error('There was a problem adding the Song.'); });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="artist">
        Artist
      </label>
      <input required type="text" id="artist" value={artist} onChange={changeArtist} />

      <label htmlFor="album">
        Album
      </label>
      <input required type="text" id="album" value={album} onChange={changeAlbum} />
      
      <label htmlFor="genre">
        Genre
      </label>
      <input required type="text" id="genre" value={genre} onChange={changeGenre} />

      <label htmlFor="bpm">
        BPM
      </label>
      <input required type="text" id="bpm" value={bpm} onChange={changeBPM} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addSong}>Submit</button>
    </form>
  );
}
AddSongForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchSongs: propTypes.func.isRequired,
  set_error: propTypes.func.isRequired,
};


function SongsObjectToArray({ Data }) {
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


function Songs() {
  const [songs, set_songs] = useState([]);
  const [error, set_error] = useState('');
  const [addingSong, setAddingSong] = useState(false);
  const showAddSongForm = () => { setAddingSong(true); };
  const hideAddSongForm = () => { setAddingSong(false); };
   
  const fetchSongs = () => {
    axios.get(SONGS_EP)
      .then(({ data }) => set_songs(SongsObjectToArray(data)))
      .catch(() => set_error('There was a problem retrieving the list of Songs.'));
  };

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
      <button type="button" onClick={showAddSongForm}>
        Add a Song
      </button>
      <AddSongForm
        visible={addingSong}
        cancel={hideAddSongForm}
        fetchSongs={fetchSongs}
        set_error={set_error}
      />
      {songs.map((song) => (
          <div className='song-container' key={song._id}>
          <h2>{song.name}</h2>
              <p>Aritst: {song.artist}</p>
              <p>Album: {song.album}</p>
              <p>Genre: {song.genre}</p>
              <p>BPM: {song.bpm}</p>
          </div>
      ))}
      {error && <ErrorMessage message={error} />}
  </div>
  );
}

export default Songs;