import React from 'react'
import './headbar.css'
import {  Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext'
import  { useState,useContext } from 'react';


function Headbar() {
  const { pictureSetup } = useContext(AuthContext);
  const { deteileSetup } = useContext(AuthContext);
  const { ProfileSetup } = useContext(AuthContext);
  const { picture,setPicture } = useContext(AuthContext);
  const { deteile,setDeteile} = useContext(AuthContext);
  const { profileUser } = useContext(AuthContext);

  const handleprofileSetup = () => {
    pictureSetup() // Call the function to set isUserLoggedIn to true
  }
  const handledeteile = () => {
    deteileSetup() // Call the function to set isUserLoggedIn to true
  }
  const handleProfile=()=>{
    ProfileSetup()
  }
  
  return (
    <div className='headbar'>
      <li>
        <p onClick={handleProfile}>Profile</p> 
      </li>
      <li>
        <p onClick={handledeteile}style={{ color: deteile ? 'blue' : 'black', }} >Deteils</p>
      </li>
      <li>
        <p onClick={handleprofileSetup}style={{ color: picture ? 'blue' : 'black', }}>Picture</p>
      </li>
    </div>
  )
}

export default Headbar