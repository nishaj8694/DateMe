import './header.css';
import React from 'react';
import { useState } from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import imG from "../loveIcon.jpeg"
import AuthContext from "../context/AuthContext";
function Header() {
  const { visible,setVisible } = useContext(AuthContext);

  const toggleMenu = () => {
    setVisible(!visible);
  };
    return (
      <>
      
      <div className="header">
        <div className='loveicon'>
          <img src={imG} alt='icon'></img>

          {/* <img src="{% static 'loveIcon.jpeg' %}" alt="icon" /> */}

        </div>
        <div className='headright'>
            <button className="offcanvas"  onClick={toggleMenu} >&#9776;</button> 
            <input type='text'  placeholder='search for user'/>
            <button id='srh'>Search</button>
            {/* <div className='frm'>
                
            </div> */}
        </div>
      </div>
     
      
      </>

    );
  }
  
  export default Header;


