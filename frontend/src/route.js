import React from "react";
// import './App.css';
// import Rote from './'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './login/Cpp';
import Home from './ome/home';
import Match from './ome/match';
import Profile from './ome/Profile/profile';
import Friends from './ome/Profile/friend';
import Cent from './ome/cent';

import Register from './regist/register';
import Otp from './regist/otp';
import Character from './regist/character';

import Forget from './regist/forgot';
import Image from './regist/imageupload';
import NewPassword from './newPas/Newpassword';
// import { useContext } from "react";
import PrivateRoute from './utils/PrivateRoute';
import { Link } from 'react-router-dom'

// import AuthContext from './context/AuthContext';

function Rote() {
  // const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>welcome to DAting app</h1>
      <Link  to="/">click to login</Link>

      
    </div>
  );
}



export default Rote;
