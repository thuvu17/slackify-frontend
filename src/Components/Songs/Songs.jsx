import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import Player from '../Player';
import { Form } from "react-bootstrap"
import { useAuth } from '../AuthProvider/AuthProvider';
// for pop-up window
import Popup from 'reactjs-popup';

const SONGS_EP = `${BACKEND_URL}/songs`;
const DELETE_SONGS_EP = `${SONGS_EP}/delete`;
const TOKEN_EP = `${BACKEND_URL}/token`;
const SONGS_URL = '/songs';


function AddSongForm({
  visible,
  cancel,
  fetchSongs,
  setError,
  setSuccessMsg,
}) {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [energy, setEnergy] = useState(0);
  const [bpm, setBPM] = useState(0);

  const changeName = (event) => { setName(event.target.value); };
  const changeArtist = (event) => { setArtist(event.target.value); };
  const changeAlbum = (event) => { setAlbum(event.target.value); };
  const changeEnergy = (event) => { setEnergy(event.target.value); };
  const changeBPM = (event) => { setBPM(event.target.value); };
  // Get error msg from backend

  const addSong = (event) => {
    event.preventDefault();
    axios.post(SONGS_EP, { name, artist, album, energy, bpm })
      .then(() => {
        setSuccessMsg(`${name} by ${artist} has been added to the database`);
        setError('');
        // Reset form fields
        setName('');
        setArtist('');
        setAlbum('');
        setEnergy(0);
        setBPM(0);
        fetchSongs();
      }
      )
    .catch(error => {
        if (error.response) {
          console.error(error.response.data);
          setError(error.response.data.message);
          setSuccessMsg('');
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

    </form>
  );
}
AddSongForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchSongs: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccessMsg: propTypes.func.isRequired,
};


function AddToPlaylistPopup({
  name,
  artist,
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);


  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Add to Playlist
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal} id='popup-box'>
        <div className="modal">
          <div className="close">
            <a  onClick={closeModal}>
            &times;</a>
          </div>
          <div className='popup-text'>
            <h3>Add the Song to Playlist</h3>
            <p><strong>Song Name:</strong> {name}</p>
            <p><strong>Song Artist:</strong> {artist}</p>
          </div>
        </div>
        <div className='popup-buttons'>
          <button type="submit" >Submit</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </Popup>
    </div>
  );
}


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
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState("")
  const [addingSong, setAddingSong] = useState(false);
  const [token, setToken] = useState('');
  const showAddSongForm = () => { setAddingSong(true); };
  const hideAddSongForm = () => { 
    setAddingSong(false);
    setError('');
    setSuccessMsg('');
  };
  // const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  // const showSongPlaylistForm = () => { setAddingToPlaylist(true); };
  // const hideSongPlaylistForm = () => { 
  //   setAddingToPlaylist(false);
  // };
  

  const { isAdmin } = useAuth()
  const navigate = useNavigate();
   
  const fetchSongs = () => {
    axios.get(SONGS_EP)
      .then(({ data }) => setSongs(SongsObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of Songs.'));
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

const delSong = (name, artist) => {
  axios.delete(`${DELETE_SONGS_EP}/${name}/${artist}`)
  .then(() => {
    navigate(`${SONGS_URL}`, {replace: true});
    fetchSongs();
    setSuccessMsg(`${name} by ${artist} has been deleted`);
  }
  )
  .catch(() => {
    setError('There was a problem deleting the playlist.');
  });
}

  return (
  <div className="wrapper">
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    <h1>View All Songs</h1>

    { isAdmin &&
    <button type="button" onClick={showAddSongForm}>
      Add a Song
    </button> }

    { isAdmin && <AddSongForm
      visible={addingSong}
      cancel={hideAddSongForm}
      fetchSongs={fetchSongs}
      setError={setError}
      setSuccessMsg={setSuccessMsg}
    /> }

    {isAdmin && error && <ErrorMessage message={error} />}
    {isAdmin && successMsg && <ErrorMessage message={successMsg} />}

    <Player
      token={token}
      trackUri={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
    />
    {songs.map((song) => (
      <div className='song-container' key={song._id}>
        <h2>{song.name}</h2>
          <div className='song-subcontainer'>
            <div>
              <p>Aritst: {song.artist}</p>
              <p>Album: {song.album}</p>
              <p>Energy: {song.energy}</p>
              <p>BPM: {song.bpm}</p>
            </div>
            <div>
              <AddToPlaylistPopup
                name={song.name}
                artist={song.artist}
              />
              <button className="del-button" onClick={() => delSong(song.name, song.artist)}>Delete</button>
            </div>
          </div>
      </div>
    ))}
    
  </div>
  );
}

export default Songs;