import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import { useAuth } from '../AuthProvider/AuthProvider';

const USERS_EP = `${BACKEND_URL}/users`;
const DELETE_USERS_EP = `${BACKEND_URL}/users/delete`;
const USERS_URL = '/users';


function AddUserForm({
  visible,
  cancel,
  fetchUsers,
  setError,
  setSuccessMsg,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changePassword = (event) => { setPassword(event.target.value); };

  const addUser = (event) => {
    event.preventDefault();
    axios.post(USERS_EP, { name, email, password })
      .then(() => {
        setSuccessMsg(`Successfully added user ${email}`);
        // Reset form fields
        setName('');
        setEmail('');
        setPassword('');
        fetchUsers();
        setError('');
      })
      .catch(error => {
        if (error.response) {
          // console.error(error.response.data);
          setSuccessMsg('');
          setError(error.response.data.message);
        }
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="email">Email</label>
      <input required type="email" id="email" value={email} onChange={changeEmail} />

      <label htmlFor="password">Password</label>
      <input required type="text" id="password" value={password} onChange={changePassword} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addUser}>Submit</button>

    </form>
  );
}
AddUserForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchUsers: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccessMsg: propTypes.func.isRequired,
};


function UsersObjectToArray({ Data }) {
  const keys = Object.keys(Data);
  const Users = keys.map((key) => Data[key]);
  return Users;
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


function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const showAddUserForm = () => { setAddingUser(true); };
  const hideAddUserForm = () => { 
    setAddingUser(false);
    setError('');
    setSuccessMsg('');
  };
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAdmin) {
  const fetchUsers = () => {
    axios.get(USERS_EP)
      .then(({ data }) => setUsers(UsersObjectToArray(data)))
      .catch(() => setError('There was a problem retrieving the list of Users.'));
  };

  const delUser = (email) => {
    axios.delete(`${DELETE_USERS_EP}/${email}`)
    .then(() => {
      navigate(`${USERS_URL}`, {replace: true});
      window.location.reload();
    }
    )
    .catch(() => {
      setError('There was a problem deleting the playlist.');
    });
  }


  useEffect(
      () => {
          axios.get(USERS_EP)
              .then((response) => {
                  setUsers(UsersObjectToArray(response.data));
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
      <h1>View All Users</h1>
      <button type="button" onClick={showAddUserForm}>
        Add a User
      </button>
      <AddUserForm
        visible={addingUser}
        cancel={hideAddUserForm}
        fetchUsers={fetchUsers}
        setError={setError}
        setSuccessMsg={setSuccessMsg}
      />
      {error && <ErrorMessage message={error} />}
      {successMsg && <ErrorMessage message={successMsg} />}
      {users.map((user) => (
        <div className='user-container' key={user._id}>
          <div className='playlist-song-subcontainer'>
            <h2>{user.name}</h2>
            <button className="del-button" onClick={() => delUser(user.email)}>Delete</button>
          </div>
          <div className='user-subcontainer'>
            <div>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p>
            </div>
          </div>
        </div>
      ))}
      
    </div>
    );
  } else {
    return(
    <h1>Access Denied</h1>
  );

  }
}

export default Users;