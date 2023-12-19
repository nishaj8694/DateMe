import React from 'react'
import AuthContext from '../context/AuthContext'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

function Match() {
  const { setIsActive } = useContext(AuthContext);
  const { setIsFactive } = useContext(AuthContext);
  const { setIsMactive } = useContext(AuthContext);
  const {setIsMessage } = useContext(AuthContext);
  const { visible,setVisible } = useContext(AuthContext);

  useEffect(() => {
    setIsActive(false)
    setIsFactive(false)
    setIsMessage(false)
    setIsMactive(true)
    setVisible(false)
  },[])
  return (
    <div>Match</div>
)
}

export default Match