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
    
    const changeFailMsg = () => { setAddUserResult('There was a problem adding the user.'); };
    const changeEmail = (event) => { setEmail(event.target.value); };
    const changePassword = (event) => { setPassword(event.target.value); };
  
    const addUser = (event) => {
      event.preventDefault();
      axios.get(`${SIGN_IN_EP}/${email}/${password}`)
        .then((response) => {
          const user_id = response.data._id;
          console.log(user_id)
            navigate(`/${user_id}`);
        })  
        .catch(() => {
          changeFailMsg();
        });
    };
  
    return (
      <form> 
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
