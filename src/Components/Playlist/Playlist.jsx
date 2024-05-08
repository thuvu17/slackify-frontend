import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import { useAuth } from '../AuthProvider/AuthProvider';

const PLAYLIST_EP = `${BACKEND_URL}/playlist`;
const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const UPDATE_PLAYLIST_NAME_EP = `${PLAYLISTS_EP}/Update`;
const DEL_PLAYLIST_EP = `${PLAYLISTS_EP}/delete`;
const DELETE_PLAYLIST_SONG_EP = `${PLAYLIST_EP}/Update/delete`;
const PLAYLISTS_URL = '/playlists';
const PLAYLIST_URL = '/playlist';


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


function UpdatePlaylistNameForm({
  name,
  visible,
  cancel,
  setError,
}) {
  const [newName, setNewName] = useState('');
  const { user_id } = useAuth();
  const changeNewName = (event) => { setNewName(event.target.value); };
  const navigate = useNavigate();

  const UpdatePlaylistName = (event) => {
    event.preventDefault();
    axios.put(`${UPDATE_PLAYLIST_NAME_EP}/${user_id}/${name}/${newName}`)
      .then(() => {
        navigate(`${PLAYLIST_URL}/${user_id}/${newName}`, {replace: true});
        window.location.reload();
      }
      )
      .catch(error => {
        if (error.response) {
          setError(error.response.data.message);
        }
      });
  };

  if (!visible) return null;
  return (
    <form className='changeNameForm'>
      <input required type="text" id="name" value={newName} onChange={changeNewName} className='name-input'/>
      <button type="submit" onClick={UpdatePlaylistName}>Submit</button>
      <button type="button" onClick={cancel}>Cancel</button>
    </form>
  );
}

UpdatePlaylistNameForm.propTypes = {
  name: propTypes.string.isRequired,
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};


function Playlist() {
  const [songs, setSongs] = useState([]);
  const [thisName, setName] = useState('');
  const [thisDate, setDate] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const params = useParams();
  const this_user_id = useState(params.user_id)[0]
  const name = useState(params.name)[0]
  const { user_id } = useAuth();
  const navigate = useNavigate();
  const [changingName, setChangingName] = useState(false);
  const showChangeNameForm = () => { setChangingName(true); };
  const hideChangeNameForm = () => { 
    setChangingName(false); 
    setError('');
  };

  if (this_user_id === user_id) {

  const fetchSongs = () => {
    axios.get(`${PLAYLIST_EP}/${user_id}/${name}`)
      .then((response) => setSongs(SongsObjectToArray(response.data.Data.songs)))
      .catch(() => setError('There was a problem retrieving the list of Songs.'));
  };

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

  const delSong = (name, artist, song_id) => {
    axios.put(`${DELETE_PLAYLIST_SONG_EP}/${user_id}/${thisName}/${song_id}`)
    .then(() => {
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
    <div><button className='return-button' onClick={handleReturn}>	&lt; Return</button></div>
    <div className='playlist-header'>
    { !changingName && <h1>{thisName}</h1> }
    { !changingName && <button type="button" onClick={showChangeNameForm} className='playlist-name-button'></button> }
    <UpdatePlaylistNameForm
      name={name}
      visible={changingName}
      cancel={hideChangeNameForm}
      setError={setError}
    />
    </div>
    
    <div className='playlist-subheader'>
      <div>
      <h3>Created on {thisDate}</h3>
        {songs.length === 0 ? (<h3>0 song</h3>) :
          (<h3>{songs.length} songs</h3>)}
      </div>
      <button className="del-button" onClick={() => delPlaylist(user_id, thisName)}>Delete</button>
    </div>

    {error && <ErrorMessage message={error} />}
    {successMsg && <ErrorMessage message={successMsg} />}
    { songs.length === 0 ? (<p>There is no song in the playlist. Go add one now.</p>)
    : (songs.map((song) => (
        <div className='playlist-song-container' key={song._id}>
          <div className='playlist-song-subcontainer'>
            <h2>{song.name}</h2>
            <button className="del-button" onClick={() => delSong(song.name, song.artist, song._id)}>Delete</button>
          </div>
            <p>Aritst: {song.artist}</p>
            <p>Album: {song.album}</p>
            <p>Energy: {song.energy}</p>
            <p>BPM: {song.bpm}</p>
      </div>
    )))}
  </div>
  );
  } else {
    return(
      <h1>Access Denied</h1>
    );
  }
}

export default Playlist;