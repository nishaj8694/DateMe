import './forgot.css'
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import { useHistory } from 'react-router';
// import './register.css';


const Forgot =()=>{
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isvalid, setIsValid] = useState(true);
    
    const {Forgot} =useContext(AuthContext)
    

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === 'email') setEmail(value);

    };

    const handleSubmit = async event => {
        event.preventDefault();
        if ( email === '') {
            setError('Fields must not be empty !');
            setIsValid(false);
        }   else {

            Forgot(email)
        }
    };
    return(
        <div className="register"> 
            <form onSubmit={handleSubmit}>
                <h3>Forgot Password</h3>
                {error && <p>{error}</p>}
               <input type="email" name="email" className={!isvalid ? 'error' : ''} placeholder="Email"
                     value={email} onChange={handleChange} id='elem' />
                 <button type="submit">Send</button>
            </form>

        </div>
    );

}
export default Forgot;
