import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const USERS_EP = `${BACKEND_URL}/users`;


function AddUserForm({
  visible,
  cancel,
  fetchUsers,
  set_error,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [add_user_result, setAddUserResult] = useState('');

  const changeName = (event) => { setName(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changePassword = (event) => { setPassword(event.target.value); };
  const changeSucessMsg = () => { setAddUserResult(`${name} by ${email} has been added to the database`); };
  const changeFailMsg = () => { setAddUserResult('There was a problem adding the user.'); };

  const addUser = (event) => {
    event.preventDefault();
    axios.post(USERS_EP, { name, email, password })
      .then(
        changeSucessMsg(),
        // Reset form fields
        setName(''),
        setEmail(''),
        setPassword(''),
        fetchUsers,
      )
      .catch(() => {
        set_error('There was a problem adding the user.');
        changeFailMsg();
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input required type="text" id="name" value={name} onChange={changeName} />

      <label htmlFor="email">Email</label>
      <input required type="text" id="email" value={email} onChange={changeEmail} />

      <label htmlFor="password">Password</label>
      <input required type="text" id="password" value={password} onChange={changePassword} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addUser}>Submit</button>

      <div className='add-user-result'>
        <td>{ add_user_result }</td>
      </div>

    </form>
  );
}
AddUserForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchUsers: propTypes.func.isRequired,
  set_error: propTypes.func.isRequired,
  add_user_result: propTypes.string.isRequired,
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
  const [users, set_users] = useState([]);
  const [error, set_error] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const showAddUserForm = () => { setAddingUser(true); };
  const hideAddUserForm = () => { setAddingUser(false); };
   
  const fetchUsers = () => {
    axios.get(USERS_EP)
      .then(({ data }) => set_users(UsersObjectToArray(data)))
      .catch(() => set_error('There was a problem retrieving the list of Users.'));
  };

  useEffect(
      () => {
          axios.get(USERS_EP)
              .then((response) => {
                  set_users(UsersObjectToArray(response.data));
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
    <h1>View All Users</h1>
    <button type="button" onClick={showAddUserForm}>
      Add a User
    </button>
    <AddUserForm
      visible={addingUser}
      cancel={hideAddUserForm}
      fetchUsers={fetchUsers}
      set_error={set_error}
    />
          {users.map((user) => (
              <div className='user-container' key={user._id}>
        <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
      </div>
    ))}
    {error && <ErrorMessage message={error} />}
  </div>
  );
}

export default Users;