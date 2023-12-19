
import React, { useState,useContext } from 'react';
import './otp.css';
import { Navigate, useNavigate } from 'react-router-dom';
import Home from '../ome/home'
import AuthContext from '../context/AuthContext'
import { useLocation } from 'react-router-dom';

const Otp=()=> {
        const [verifyOTP, setVerifyotp]= useState('');
        const navigate= useNavigate();
        const [error, setError]= useState('');
        const [isvalid, setIsvalid]= useState(true);
        const {verifyotp} = useContext(AuthContext)
        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email');

        


        const Otphandle =()=>{    
            if (verifyOTP ===''){
                setError('*Field must not be empty!');
                setIsvalid(false);
            }
            else{
                verifyotp(verifyOTP,email)

            }
        }
        return (
            <div className='Otppage'>
                <div className="Otp">
                   <h1>VERIFY OTP</h1>
                   {error && <p id='OtpP'>{error}</p>}
                   <input type='text' name='username' placeholder='Enter Your OTP' value={verifyOTP} className={!isvalid ? 'error' : ''}  onChange={(e)=>setVerifyotp(e.target.value)} id='otptext'></input>
                   <button type='button' onClick={Otphandle} id='otpbutton'>Submit OTP</button>       
               </div>
            </div>
           
        );
}

export default Otp;
