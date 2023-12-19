import React from 'react'
import Headbar from './headbar'
import Pic from './picture'
import Deteils from './deteils'
import './profile.css'
import AuthContext from '../../context/AuthContext'
import  { useState,useContext,useEffect } from 'react';
import axios from 'axios'; 

function Profile() {
  // const { profileuser } = useContext(AuthContext);
  const { picture } = useContext(AuthContext);
  const { deteile } = useContext(AuthContext);
  const basePhotoUrl = 'http://127.0.0.1:8000';
  const [data, setData] = useState([]);
  const { setIsActive } = useContext(AuthContext);
  const { setIsFactive } = useContext(AuthContext);
  const { setIsMactive } = useContext(AuthContext);
  const {setIsMessage } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { visible,setVisible } = useContext(AuthContext);

  useEffect(() => {
    setIsActive(true)
    setIsFactive(false)
    setIsMactive(false)
    setIsMessage(false)
    setVisible(false)
    axios.get('http://localhost:8000/api/get_PersonalData/', {
      params: {
        user: user.user_id
      }
    })
      .then(response => {
        console.log(response.data)
        setData(response.data);

      })
      .catch(error => {
        console.log('error occured')
      });
  }, [user.user_id]);

  return (
    <div className='profileHome'> 
       <Headbar />
       {picture&&<Pic />}
       {deteile&&<Deteils />}
       {!picture && !deteile &&(
          <div>
            {data.map((profile) => (              
              <div style={{paddingTop:'10px'}} key={profile.id}>
                <div className='picturecol'>
                  {profile.user.map((j,k) => (
                    <div className='picturRow'>
                        <img src={`${basePhotoUrl}${j.image}`} alt={`Image ${profile.id}`}
                            style={{ width: '100%', height: '100%' }}/>
                    </div>
                  ))}  
                </div>
                {/* <div style={{display:'flex',flexWrap:'wrap'}}>
                    <h3>Name : </h3><h5>{profile.full_name}</h5>
                    <h3>Name : <span style={{fontSize:'medium'}}>{profile.full_name}</span></h3>
                   
                </div> */}
                  <table>
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>{profile.full_name}</td>
                      </tr>
                      <tr>
                        <td>Height</td>
                        <td>{profile.height}</td>
                      </tr>
                      <tr>
                        <td>Weight</td>
                        <td>{profile.weight}</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>{profile.gender}</td>
                      </tr> <tr>
                        <td>Date of birth</td>
                        <td>{profile.birth}</td>
                      </tr> 
                    </tbody>
                  </table>
             </div>
            ))}
          </div>
       )
      }     
    </div>
   )
  }

export default Profile