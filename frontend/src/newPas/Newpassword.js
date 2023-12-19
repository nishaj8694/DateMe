import './Newpassword.css';
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import { useHistory } from 'react-router';


function Newpasswordd() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    // const { id } = useParams(); 
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isvalid, setIsValid] = useState(true);
    
    const {newPassword} = useContext(AuthContext)

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === 'password') setPassword(value);
        else if (name === 'password2') setPassword2(value);

    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (password === '' || password2 === '') {
            setError('Fields must not be empty !');
            setIsValid(false);
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters !');
            setIsValid(false);
        }else if(password !== password2){
            setError('Password and Conform Password must be same !')
            setIsValid(false);

        }  else {
            newPassword(id,password,password2)
        }
    };

    return (
        <div className="register"> 
           <form onSubmit={handleSubmit}>
                <h3>Reset Password</h3>
                {error && <p>{error}</p>}
                <input type="password" name="password" className={!isvalid ? 'error' : ''} placeholder="Password"
                    value={password} onChange={handleChange} id='elem' />
                 <input type="password" name="password2" className={!isvalid ? 'error' : ''} placeholder="Conform Password"
                    value={password2} onChange={handleChange} id='elem' />    
                <button type="submit">Change</button>
            </form>

        </div>    

    );
}

export default Newpasswordd;



