import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import { useAuth } from '../AuthProvider/AuthProvider';

const PLAYLIST_EP = `${BACKEND_URL}/playlist`;
const PLAYLISTS_EP = `${BACKEND_URL}/playlists`;
const UPDATE_PLAYLIST_NAME_EP = `${PLAYLISTS_EP}/Update`;
const DEL_PLAYLIST_EP = `${PLAYLISTS_EP}/delete`;
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
          // console.error(error.response.data);
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
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};


function Playlist() {
  const [songs, setSongs] = useState([]);
  const [thisName, setName] = useState('');
  const [thisDate, setDate] = useState('');
  const [error, setError] = useState('');
  const { user_id, name } = useParams();
  const navigate = useNavigate();
  const [changingName, setChangingName] = useState(false);
  const showChangeNameForm = () => { setChangingName(true); };
  const hideChangeNameForm = () => { 
    setChangingName(false); 
    setError('');
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
      <h3>Date Created: {thisDate}</h3>
      <button className="del-button" onClick={() => delPlaylist(user_id, thisName)}>Delete</button>
    </div>

    {error && <ErrorMessage message={error} />}
    {songs.length === 0 ? (
      <p>There is no song in the playlist. Go add one now.</p>
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
    
    
  </div>
  );
}

export default Playlist;