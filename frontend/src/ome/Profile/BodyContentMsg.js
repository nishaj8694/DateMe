import React,{useState,useContext, useEffect} from 'react'
import './BodyContentMsg.css'
import AuthContext from '../../context/AuthContext'
import axios from 'axios';


function BodyContentMsg() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [chat_text, setChat] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);
    const {MsgInfo } = useContext(AuthContext);
    const {roomName, setRoom } = useContext(AuthContext);
    const {chatsocket,setChatSocket } = useContext(AuthContext);


    useEffect(()=>{
        axios.get('http://localhost:8000/api/get_chat/', {
          params: {
            user: user.user_id,
            recevier:MsgInfo.id

          }
        })
          .then(response => {
            if(response.status==204){
              setError(true)
              
            }
            else{
              setData(response.data);
              // console.log('its worked',response.data)
              if (response.data.length > 0) {
                const roomData = response.data[0];
                const coupleValue = roomData.couple;
                setRoom(coupleValue);
              }
            }
          })
          .catch(error => {
            
          });
      },[MsgInfo]);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8000/ws/chat/' + roomName + '/');
    setSocket(newSocket);
    newSocket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setData((prevMessages) => [...prevMessages, messageData]);
    };
    newSocket.onclose = (event) => {
      // console.log('WebSocket connection closed:', event);
      };

    newSocket.onerror = (error) => {
        // console.error('WebSocket error:', error);
      };

    return () => {
      newSocket.close();
    };
  }, [roomName]);

  useEffect(() => {
    const rightSocket = new WebSocket('ws://localhost:8000/ws/right/');
    setChatSocket(rightSocket);
    rightSocket.onclose = (event) => {
      // console.log('WebSocket connection closed:', event);
      };

    rightSocket.onerror = (error) => {
        // console.error('WebSocket error:', error);
      };

    return () => {
      rightSocket.close();
    };
  }, []);
  const handleChat = () =>{ 
  if (socket.readyState === WebSocket.OPEN) {
    if (chat_text.trim() !== '') {
      socket.send(JSON.stringify({ content: chat_text,user: user.user_id,room:roomName}));
      chatsocket.send(JSON.stringify({ content: chat_text,user: user.user_id,room:roomName,timestamp: new Date().toISOString()}))
      setChat('');
    }
  }
  };

 return (
    <div className='BodyContent1'>
      { error ? <div> <p>Error while Getting messages</p></div> :
        <div>
          {(data.map((profile,index) =>(
              <div className={profile.user === user.user_id ? 'p_left' : 'p_right'} key={index}>{profile.content}</div>
          )))}
        </div>
      } 
      <div className='Bodysend'>  
         <input type='text' name='chatmsg' value={chat_text} onChange={(e)=>setChat(e.target.value)}></input>
         <button id='sendmsg' onClick={handleChat}>send</button>
      </div>
    </div>
  )
}

export default BodyContentMsg