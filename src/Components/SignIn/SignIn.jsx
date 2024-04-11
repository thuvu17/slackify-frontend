import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';

const USER_MENU_URL = '/user_menu';
const SIGN_IN_EP = `${BACKEND_URL}/sign_in`;

function Form({ fields, handleSubmit, initValues, messageInfo }) {

    const [formContent, setFormContent] = useState({});


    const answerQuestion = (fieldName, value) => {
        formContent[fieldName] = value;
        setFormContent({ ...formContent });
    };

    const getInitFields = () => {
        let initObj = {};
        fields.forEach(({ id }) => { initObj[id] = ''; });
        return initObj;
    }

    useEffect(() => {
        let initObj = {};
        if (initValues) {
            initObj = initValues
        } else {
            initObj = getInitFields()
        }
        setFormContent(initObj)
    }, [fields, initValues])

    return (
        <form>
            {
                fields.map((item) => {
                    const { id, label, type, placeholder } = item
                    return (
                        <Fragment key={id || ''}>
                            <label htmlFor={id}>{label}</label>
                            <input
                                required
                                type={type}
                                placeholder={placeholder}
                                id={id}
                                value={formContent[id]}
                                onChange={(e) => { answerQuestion(id, e.target.value); }}
                            />
                        </Fragment>
                    )
                })
            }
            <button type="submit" onClick={() => handleSubmit(formContent)}>Submit</button>
            {messageInfo
                &&
                <span
                    style={{ color: messageInfo.status === 'error' ? 'red' : 'green' }}
                >
                    {messageInfo.value}
                </span>
            }
        </form>
    )
}

Form.propTypes = {
    fields: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        label: propTypes.string,
        placeholder: propTypes.string,
        type: propTypes.string,
    })).isRequired,
    handleSubmit: propTypes.func.isRequired,
    messageInfo: propTypes.shape({
        value: propTypes.string,
        status: propTypes.string,
    }),
    initValues: propTypes.object.isRequired
};

const FORM = [
    {
        id: 'email',
        label: 'Email',
        placeholder: 'Enter email',
        type: 'text',
    },
    {
        id: 'password',
        label: 'Password',
        placeholder: 'Enter password',
        type: 'password',
    },
];

function SignInForm() {
    const navigate = useNavigate();
    const [user, setUser] = useState()
    const [messageInfo, setMessageInfo] = useState()

    const handleSubmit = async (user) => {
        console.log(user);
        try {
            localStorage.setItem('user', JSON.stringify(user))
            // send the email and password to the server
            await axios.post(
                // need to change the link here
                "http://blogservice.herokuapp.com/api/login",
                user
            );
            await axios.get(`${SIGN_IN_EP}/${user.email}/${user.password}`)
                .then((response) => {
                    const user_id = response.data._id;
                    navigate(`${USER_MENU_URL}/${user_id}`, { replace: true });
                })
                .catch(error => {
                    let errorObj = {
                        status: 'error',
                        value: 'There was a problem adding the user.'
                    }
                    if (error.response) {
                        errorObj.value = error.response
                    }
                    setMessageInfo(errorObj)
                });
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            console.log(foundUser, 'foundUser----');
            setUser(foundUser);
        }
    }, [])

    return (
        <div className='wrapper'>
            <h1>Sign In</h1>
            <Form
                fields={FORM}
                handleSubmit={handleSubmit}
                initValues={user}
                messageInfo={messageInfo}
            />
        </div>

    )
}

export default SignInForm