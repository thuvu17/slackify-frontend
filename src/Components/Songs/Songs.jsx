import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const SONGS_ENDPOINT = `${BACKEND_URL}/songs`;

function AddSongForm({
  visible,
  cancel,
  fetchSongs,
  setError,
}) {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [bpm, setBpm] = useState(0);

  const changeName = (event) => { setName(event.target.value); };
  const changeArtist = (event) => { setArtist(event.target.value); };
  const changeAlbum = (event) => { setAlbum(event.target.value); };
  const changeGenre = (event) => { setGenre(event.target.value); };
  const changeBpm = (event) => { setBpm(event.target.value); };


  const addSong = (event) => {
    event.preventDefault();
    axios.post(SONGS_ENDPOINT, { name, artist, album, genre, bpm })
      .then(fetchSongs)
      .catch(() => { setError('There was a problem adding the song.'); });
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
      <input required type="text" id="artist" onChange={changeArtist} />
      <label htmlFor="album">
        Album
      </label>
      <input required type="text" id="album" onChange={changeAlbum} />
      <label htmlFor="genre">
        Genre
      </label>
      <input required type="text" id="genre" onChange={changeGenre} />
      <label htmlFor="bpm">
        BPM
      </label>
      <input required type="number" id="bpm" onChange={changeBpm} />
      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addSong}>Submit</button>
    </form>
  );
}
AddSongForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchSongs: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

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

function Song({ song }) {
  const { name, artist, album, genre, bpm } = song;
  return (
    <div className="song-container">
      <h2>{name}</h2>
      <p>
              Artist: {artist}
              Album: {album}
              Genre: {genre}
              BPM: {bpm}
      </p>
    </div>
  );
}
Song.propTypes = {
  song: propTypes.shape({
  name: propTypes.string.isRequired,
  artist: propTypes.string.isRequired,
  album: propTypes.string.isRequired,
  genre: propTypes.string.isRequired,
  bpm: propTypes.number.isRequired,
  }).isRequired,
};

function songsObjectToArray({ Data }) {
  const keys = Object.keys(Data);
  const songs = keys.map((key) => Data[key]);
  return songs;
}

function Songs() {
  const [error, setError] = useState('');
  const [songs, setSongs] = useState([]);
  const [addingSong, setAddingSong] = useState(false);

  const fetchSongs = () => {
    axios.get(SONGS_ENDPOINT)
      .then(({ data }) => setSongs(songsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of songs.'));
  };

  const showAddSongForm = () => { setAddingSong(true); };
  const hideAddSongForm = () => { setAddingSong(false); };

  useEffect(fetchSongs, []);

  return (
    <div className="wrapper">
      <header>
        <h1>
          View All Songs
        </h1>
        <button type="button" onClick={showAddSongForm}>
          Add a Song
        </button>
      </header>
      <AddSongForm
        visible={addingSong}
        cancel={hideAddSongForm}
        fetchSongs={fetchSongs}
        setError={setError}
      />
      {error && <ErrorMessage message={error} />}
      {songs.map((song) => <Song key={song.name} song={song} />)}
    </div>
  );
}

export default Songs;
