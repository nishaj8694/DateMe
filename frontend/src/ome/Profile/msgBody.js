import React from 'react'
import './msgBody.css'
import  { useState, useEffect,useContext } from 'react';
import AuthContext from '../../context/AuthContext'
import BodyChat from './BodyContentMsg'
import 'font-awesome/css/font-awesome.min.css';

function MsgBody() {
  const {MsgInfo } = useContext(AuthContext);
  const {setIsMessage } = useContext(AuthContext);
  const basePhotoUrl = 'http://127.0.0.1:8000'; 

  return (
    <div className='msgBody'>
      <i onClick={()=>setIsMessage(false)} className="fa fa-arrow-left" aria-hidden="true"></i>
      <div className='BodyHead'>
        <div className='BodyHeadLog'>
            <img src={`${basePhotoUrl}${MsgInfo.images[0].Photo}`} alt="Logo" />
            <label>{MsgInfo.full_name.charAt(0).toUpperCase() + MsgInfo.full_name.slice(1)}</label>
            
        </div> 
      </div>
      <div className='BodyContent'>
         <BodyChat />
      </div>
    </div>
  )
}

export default MsgBody