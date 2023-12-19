import React from "react";
import './App.css';
import Rote from './route'

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
// import AuthContext from './context/AuthContext';

function App() {
  // const { user } = useContext(AuthContext);
  return (
    <div className="App">
      
      <Router>
        <AuthProvider>
          {/* <LoginPage /> */}
          {/* <Rote /> */}

          <Routes>
            <Route element={<PrivateRoute />}>
                <Route path="/api/home" element={<Home />}>
                  <Route index element={<Cent />} />
                  <Route path="Match" element={<Match />} />
                  <Route path="Profile" element={<Profile />} />
                  <Route path="Friends" element={<Friends />} />
                </Route>  
                <Route path="/api/image" element={<Image />} />
                <Route path="/api/character" element={<Character />} />
                {/* <Route path="/api/home/match" element={<Match />} /> */}
            </Route>
            <Route path="/api/NewPassword" element={<NewPassword />} />
            <Route path="/api/" element={<LoginPage />} />
            <Route path="/api/register" element={<Register />} />
            <Route path="/api/otp" element={<Otp />} />
            <Route path="/api/forgot" element={<Forget />} />
          </Routes> 
          
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
