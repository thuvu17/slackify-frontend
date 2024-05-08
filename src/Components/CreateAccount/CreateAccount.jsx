import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const CREATE_ACCOUNT_EP = `${BACKEND_URL}/users`;


function CreateAccountForm() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [createUserResult, setCreateUserResult] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [error, setError] = useState('');

  const changeName = (event) => { setName(event.target.value); }
  const changeEmail = (event) => { setEmail(event.target.value); } 
  const changePassword = (event) => {setPassword(event.target.value)}
  const changeRePassword = (event) => {setRePassword(event.target.value)}
  const changeSucessMsg = () => { setCreateUserResult(`Account ${email} has been created. Log in with your email and password now.`); };

  const createUser = (event) => {
      event.preventDefault();

        if (password !== repassword) {
            setError('Passwords do not match.');
            return
        }
      axios.post(CREATE_ACCOUNT_EP, {name, email, password})
        .then(() => {
            changeSucessMsg();
            },
            setName(''),
            setEmail(''),
            setPassword(''),
            setRePassword(''),
            setError('')
        )
        .catch(error => {
          if (error.response) {
            console.error(error.response.data);
            setError(error.response.data.message);
        }
        });
  }

    return (
      <form>
        <h2>Create Account Page</h2>

        {error && <ErrorMessage message={error} />}

        { createUserResult && 
          <div className='create-user-result'>
            <td>{ createUserResult }</td>
             <Link to="/sign_in">Go to Sign In</Link>
        </div>}

        <label htmlFor="name">Name</label>
        <input required type="text" id="name" value={name} onChange={changeName} />

        <label htmlFor="email">Email</label>
        <input required type="text" id="email" value={email} onChange={changeEmail} />

        <label htmlFor="password">Password</label>
        <input required type= {showPassword ? "text" : "password"} id="password" value={password} onChange={changePassword} />
        <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? 'Hide' : 'Show'} Password
        </button>

        <label htmlFor="repassword">Re-Enter Password</label>
        <input required type= {showRePassword ? "text" : "password"} id="password" value={repassword} onChange={changeRePassword} />
        <button type="button" onClick={() => setShowRePassword((prev) => !prev)}>
          {showRePassword ? 'Hide' : 'Show'} Password
        </button>

        <button type="submit" onClick={createUser}>Submit</button>

        </form>
    );
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

export default CreateAccountForm