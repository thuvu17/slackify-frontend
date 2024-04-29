import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import Player from '../Player';

const SONGS_EP = `${BACKEND_URL}/songs`;
const TOKEN_EP = `${BACKEND_URL}/token`;


function AddSongForm({
  visible,
  cancel,
  fetchSongs,
  setError,
}) {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [energy, setEnergy] = useState(0);
  const [bpm, setBPM] = useState(0);
  const [addSongResult, setAddSongResult] = useState('');

  const changeName = (event) => { setName(event.target.value); };
  const changeArtist = (event) => { setArtist(event.target.value); };
  const changeAlbum = (event) => { setAlbum(event.target.value); };
  const changeEnergy = (event) => { setEnergy(event.target.value); };
  const changeBPM = (event) => { setBPM(event.target.value); };
  const changeSucessMsg = () => { setAddSongResult(`${name} by ${artist} has been added to the database`); };
  const changeFailMsg = () => { setAddSongResult('There was a problem adding the song.'); };
  // Get error msg from backend

  const addSong = (event) => {
    event.preventDefault();
    axios.post(SONGS_EP, { name, artist, album, energy, bpm })
      .then(
        changeSucessMsg(),
        // Reset form fields
        setName(''),
        setArtist(''),
        setAlbum(''),
        setEnergy(0),
        setBPM(0),
        fetchSongs,
      )
    .catch(error => {
        if (error.response) {
          console.error(error.response.data);
          setError(error.response.data.message);
        } else {
          // Something else happened while setting up the request
          changeFailMsg();
        }
      });
    };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="artist">Artist</label>
      <input required type="text" id="artist" value={artist} onChange={changeArtist} />

      <label htmlFor="album">Album</label>
      <input required type="text" id="album" value={album} onChange={changeAlbum} />
      
      <label htmlFor="genre">Energy</label>
      <input required type="text" id="genre" value={energy} onChange={changeEnergy} />

      <label htmlFor="bpm">BPM</label>
      <input required type="text" id="bpm" value={bpm} onChange={changeBPM} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addSong}>Submit</button>

      <div className='add-song-result'>
        <td>{ addSongResult }</td>
      </div>

    </form>
  );
}
AddSongForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchSongs: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  addSongResult: propTypes.string,
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
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');
  const [addingSong, setAddingSong] = useState(false);
  const [token, setToken] = useState('');
  const showAddSongForm = () => { setAddingSong(true); };
  const hideAddSongForm = () => { setAddingSong(false); };
   
  const fetchSongs = () => {
    axios.get(SONGS_EP)
      .then(({ data }) => setSongs(SongsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of Songs.'));
  };

  const fetchToken = () => {
    axios.get(TOKEN_EP)
      .then(({ data }) => setToken(data))
      .catch(() => setError('There was a problem retrieving the token'));
  };

  useEffect(
      () => {
          axios.get(SONGS_EP)
              .then((response) => {
                  setSongs(SongsObjectToArray(response.data));
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

  useEffect(
    () => {
        axios.get(TOKEN_EP)
            .then((response) => {
                setToken(response.data);
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
    <h1>View All Songs</h1>
    <button type="button" onClick={showAddSongForm}>
      Add a Song
    </button>
    <AddSongForm
      visible={addingSong}
      cancel={hideAddSongForm}
      fetchSongs={fetchSongs}
      setError={setError}
    />
    <Player
      token={token}
      trackUri={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
    />
    {songs.map((song) => (
      <div className='song-container' key={song._id}>
        <h2>{song.name}</h2>
          <p>Aritst: {song.artist}</p>
          <p>Album: {song.album}</p>
          <p>Energy: {song.energy}</p>
          <p>BPM: {song.bpm}</p>
      </div>
    ))}
    {error && <ErrorMessage message={error} />}
  </div>
  );
}

export default Songs;