import React, { useState,useRef,useContext } from 'react';
import './Cpp.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from '../ome/home';

import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
const swal = require('sweetalert2')



const Cpp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(true);
    
    const { user } = useContext(AuthContext);
    const passwordRef = useRef(null);
    const {loginUser} = useContext(AuthContext)
    const {Forgot} =useContext(AuthContext)

    const handleKeyPress = (event, nextInput) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          passwordRef.current.focus();
        }
      };
    const handle = async event => {
        event.preventDefault();
        if (email === '' && password === '') { 
            
            setError('Email and password are not defined'); 
            setIsValid(false);
            swal.fire({
                title: "Email or Password Not Empty !",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsValid(false);
            swal.fire({
                title: "Password must be 8 characters !",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            setPassword('');

        } else {
            email.length > 0 && loginUser(email, password)
        }
    };

    return (
        // user ? (navigate('/home') ) :
        user ? <Home /> :

        <div className="Cpp">
            <div className='cppBox'>
                <h3>Login Page</h3>
                {/* {error && <p>{error}</p>} */}
                <label htmlFor='appinput'>Email</label><br />
                <input
                    type='text' placeholder='Enter Your Email' value={email}
                    onChange={(e) => setEmail(e.target.value)} onKeyPress={(e) => handleKeyPress(e, passwordRef)}
                    className={!isValid ? 'error' : ''} id='appinput'
                /><br />
                <label htmlFor='appinput1'>Password</label><br />
                <input
                    type='password' placeholder='Enter Your Password' value={password} 
                    onChange={(e) => setPassword(e.target.value)} ref={passwordRef}
                    className={!isValid ? 'error' : ''} id='appinput1'
                />
                <button type='button' onClick={handle} >LOGIN</button>
                <Link  to="/api/register" style={{float:'left'}}>Don't have an account</Link><Link to='/api/forgot' style={{float:'right'}}>Forgot Password</Link> 
            </div>
        </div>
    );
}

export default Cpp;
