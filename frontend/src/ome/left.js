import './left.css';
import AuthContext from '../context/AuthContext'
import  { useState,useContext } from 'react';
import jwt_decode from "jwt-decode";
// import {  useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {  Link } from "react-router-dom";



function Left() {
  const [person, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );
  const { user,  logoutUser } = useContext(AuthContext);
  const { profileUser } = useContext(AuthContext);
  const { renderUser } = useContext(AuthContext);
  const { isActive } = useContext(AuthContext);
  const { isFactive } = useContext(AuthContext);
  const { friendUser } = useContext(AuthContext);
  const { isMatch,setIsMatch } = useContext(AuthContext);


  const handleprofile = () => {
    profileUser() // Call the function to set isUserLoggedIn to true
  }
  const history = useNavigate();

  const handleMatch=()=>{
    // history('/home/match')
    setIsMatch(true)

  }

  const handleRerender = () => {
    renderUser()
    
  };
  const handlefriend = () => {
    friendUser()
    
  };
   return (
      <div className="left">
        {/* {console.log(isActive)} */}
        <h3 id='loggeduser'>Logged User : {person.username.charAt(0).toUpperCase() + person.username.slice(1)}</h3>
        <h4 onClick={handleRerender} >
          <span  className='leftarrow Home'> Home</span>
          {/* <img src='./home.png'></img>
          <span id='homelabel'>Home</span> */}
       
        </h4>
        <h4>
          <span onClick={handleMatch} className='leftarrow'>Match</span>
        </h4>
        <h4><span onClick={profileUser} className={`leftarrow ${isActive ? 'active' : ''}`}>Profile</span></h4>      
        <h4><span onClick={handlefriend }className={`leftarrow ${isFactive ? 'active' : ''}`} >Friends</span></h4>      
        <button onClick={logoutUser} id='logout'>LOGOUT</button>
      </div>
    );
  }
  
  export default Left;