import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const USER_MENU_URL = '/user_menu';
const FORM_EP = `${BACKEND_URL}/form`;
const SIGN_IN_EP = `${BACKEND_URL}/sign_in`;


function SignInForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [login_error, setLoginError] = useState('');
    const [form_error, setFormError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = formData.email;
        const password = formData.password;
        axios.get(`${SIGN_IN_EP}/${email}/${password}`)
            .then((response) => {
                const user_id = response.data._id;
                console.log(response);
                navigate(`${USER_MENU_URL}/${user_id}`, {replace: true});
            })  
            .catch(() => {
                setLoginError('Wrong email or password. Please try again.');
            });
    };
    
    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(FORM_EP);
                const init_form_data = response.data.form_description;
                setFormData(
                    Object.keys(init_form_data).reduce((acc, key) => {
                        acc[key] = '';
                        return acc;
                    }, {})
                );
            } catch (form_error) {
                setFormError('There was an error fetching the form description. Please try again.');
            }
        };
        fetchForm();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [id]: value,
        }));
      };


    return (
    <div>
        <h2>Sign In Page</h2>
        <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                <label htmlFor={key}>{key}</label>
                <input
                    type={key === 'password' ? 'password' : 'text'}
                    id={key}
                    value={value || ''}
                    onChange={handleInputChange}
                />
                </div>
            ))}
                {form_error && <div style={{ color: 'red' }}>{form_error}</div>}
                {login_error && <div style={{ color: 'red' }}>{login_error}</div>}
        <button type="submit">Login</button>
        </form>
        <br />
    </div>
    );
}

export default SignInForm