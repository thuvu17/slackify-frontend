import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const SIGN_IN_EP = `${BACKEND_URL}/sign_in`;


function SignInForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [addUserResult, setAddUserResult] = useState('');
    const [user, setUser] = useState()

    const changeFailMsg = () => { setAddUserResult('There was a problem adding the user.'); };
    const changeEmail = (event) => { setEmail(event.target.value); };
    const changePassword = (event) => { setPassword(event.target.value); };

    const handleSubmit = async e => {
      e.preventDefault();
      const user = { email, password };
      // send the email and password to the server
      const response = await axios.post(
        "http://blogservice.herokuapp.com/api/login",
      user
    );
    // set the state of the user
    setUser(response.data)
    // store the user in localStorage
    localStorage.setItem('user', response.data)
    console.log(response.data)
      
    };

    if (user) {
      return <div>{user.email} is loggged in</div>;
    }

    const addUser = (event) => {
      event.preventDefault();
      axios.post(SIGN_IN_EP/email/password)
        .then(
            navigate(`/${email}`)
        )
        .catch(() => {
          changeFailMsg();
        });
    };
  
    return (
      <form onSubmit={handleSubmit}> 
        <label htmlFor="email">Email</label>
        <input required type="text" placeholder="Enter email" id="email" value={email} onChange={changeEmail}/>
  
        <label htmlFor="password">Password</label>
        <input required type="password" placeholder="Enter password" id="password" value={password} onChange={changePassword}/>
  
        <button type="submit" onClick={addUser}>Submit</button>
  
        <div className='add-user-result'>
          <td>{ addUserResult }</td>
        </div>
  
      </form>
    );
  }
  SignInForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
    addUserResult: propTypes.string.isRequired,
  };


function SignIn() {
    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <SignInForm/>
        </div>      
    );
}
  
export default SignIn;
