import React from 'react'
import './message.css'
import MessegeBody from './msgBody'
import MessegeHedder from './msgHedder'

function Message() {
  return (
    <div className='msg'>
        <MessegeHedder />        
        <MessegeBody />
        
    </div>
      )
}

export default Message