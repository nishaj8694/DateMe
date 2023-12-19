import './register.css';
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import { useHistory } from 'react-router';


function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isvalid, setIsValid] = useState(true);
    
    const {registerUser} = useContext(AuthContext)

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === 'username') setUsername(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'password2') setPassword2(value);

    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (username === '' || password === '' || email === '') {
            setError('Fields must not be empty !');
            setIsValid(false);
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters !');
            setIsValid(false);
        }else if(password !== password2){
            setError('Password and Conform Password must be same !')
            setIsValid(false);

        }  else {

            registerUser(email, username, password,password2)
            // try {
            //     const formData = {
            //         username: username,
            //         email: email,
            //         password: password
            //     };

            //     const response = await axios.post('http://localhost:8000/app/api/register/', formData);
            //     console.log('Registration successful:', response.data);
            //     navigate('/otp');
            // } catch (error) {
            //     console.error('Registration error:', error);
            // }
        }
    };

    return (
        <div className="register"> 
           <form onSubmit={handleSubmit}>
                <h3>User Registration</h3>
                {error && <p>{error}</p>}
                <input type="text" name="username" className={!isvalid ? 'error' : ''} placeholder="Username"
                    value={username} onChange={handleChange} id='elem'/>
                <input type="email" name="email" className={!isvalid ? 'error' : ''} placeholder="Email"
                     value={email} onChange={handleChange} id='elem' />
                <input type="password" name="password" className={!isvalid ? 'error' : ''} placeholder="Password"
                    value={password} onChange={handleChange} id='elem' />
                 <input type="password" name="password2" className={!isvalid ? 'error' : ''} placeholder="Conform Password"
                    value={password2} onChange={handleChange} id='elem' />    
                <button type="submit">REGISTER</button>
            </form>

        </div>    

    );
}

export default Register;


