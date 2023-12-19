import './right.css';
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment,faEnvelope  } from '@fortawesome/free-regular-svg-icons';

function Right() {
  const { user } = useContext(AuthContext);
  const [data,setData]=useState([]);
  const [error,setError]=useState(false)
  const basePhotoUrl = 'http://127.0.0.1:8000'; 
  const [socket, setSocket] = useState(null);
  const {roomName, setRoom } = useContext(AuthContext);
  const {chatsocket,setChatSocket } = useContext(AuthContext);
  
  const updateUserData = (messageData) => {
    setData((prevData) => {
      const updatedData = prevData.map((profile) => {
        if (profile.id === messageData.user) {
          return {
            ...profile,
            timestamp: messageData.timestamp,
            last_message: messageData.message,
          };
        }
        return profile;
      });
      const sortedData = updatedData.sort((a, b) => {
        if (!a.timestamp && !b.timestamp) {return 0;
        } else if (!a.timestamp) {return 1;
        } else if (!b.timestamp) {return -1;
        }
        return b.timestamp.localeCompare(a.timestamp);
      });
      return sortedData;
    });
  };
  

  
  useEffect(()=>{
    axios.get('http://localhost:8000/api/get_chatNotifications/',{
      params: {
        user: user.user_id,
      }
  })
  .then(responce =>{
    if (responce.status==200){
      setData(responce.data)
      // console.log(responce.data)
      const rightSocket = new WebSocket('ws://localhost:8000/ws/right/');
          setChatSocket(rightSocket);
          rightSocket.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            updateUserData(messageData);
          };

          rightSocket.onclose = (event) => {
            // Handle WebSocket close
          };

          rightSocket.onerror = (error) => {
            // Handle WebSocket error
          };
          

    }
    else{
      setError(true)
      
    }
  })
  .then(error=>{
    setError(true)
  })

  },[])
    return (
      <div>
        {(data.map((profile)=>(
          <div className='chatLog'>
              <img src={`${basePhotoUrl}/media/${profile.image}`} alt="Logo" />
              <label>{profile.name}</label>
              <div className='notification'>
                  <FontAwesomeIcon icon={faEnvelope} className='custom-icon'/>
                 {profile.timestamp && <div className='badge'>new</div>}
              </div>
          </div> 
        )
        ))}
        
      </div>                                    
    );
  }
  
  export default Right;