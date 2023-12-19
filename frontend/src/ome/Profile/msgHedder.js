import React, { useEffect,useState,useContext } from 'react'
import './msgHedder.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AuthContext from '../../context/AuthContext'



function MsgHedder() {
  const { user } = useContext(AuthContext);
  const {MsgInfo } = useContext(AuthContext);
  const { messageUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const {setIsMessage } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:8000/api/get_friendsdata/', {
      params: {
        user: user.user_id
      }
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        
      });
  }, [user.user_id]);
  return (
    <div className='msgHedder'>
      <div>Friends List</div>
      {
        (data.map((profile,index) =>
            <div onClick={()=>messageUser(profile)} key={index}>
              <span className={`spanspace ${ profile.id==MsgInfo.id ? 'active' : ''}`}><FontAwesomeIcon icon={faUser} />
              {profile.full_name.charAt(0).toUpperCase() + profile.full_name.slice(1)}
                {/* {profile.id==MsgInfo.id?console.log('worked'):console.log('not worked')} */}
                
              </span>
            </div>
          )
        )
      }
      <div onClick={()=>setIsMessage(false)} className='backbutton' style={{borderBottom:'none'}}><p>Back</p></div>

    </div>
  )
}

export default MsgHedder