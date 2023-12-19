import React from 'react'
import AuthContext from '../../context/AuthContext'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import axios
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './friend.css';
import { FaCoffee } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import MessageProfile from './message'

function Friend() {
    const basePhotoUrl = 'http://127.0.0.1:8000';
    const [data, setData] = useState([]);
    const [error,setError]= useState(false)
    const [empty,setEmpty]= useState(false)

    const [currdata, setCurrData] = useState([]);
    const {isMessage } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const { messageUser } = useContext(AuthContext);
    const { setIsActive } = useContext(AuthContext);
    const { setIsFactive } = useContext(AuthContext);
    const { setIsMactive } = useContext(AuthContext);
    const { visible,setVisible } = useContext(AuthContext);

    const setup = {
        dots: true, 
        infinite: true, 
        speed: 4000, 
        autoplay:true, 
        autoplaySpeed: 5000, 
        slidesToShow: 1, 
        slidesToScroll: 1, 
      };
    useEffect(() => {
        setIsActive(false)
        setIsFactive(true)
        setIsMactive(false)
        setVisible(false)

        axios.get('http://localhost:8000/api/get_friendsdata/', {
          params: {
            user: user.user_id
          }
        })
          .then(response => {
            if (response.data.length > 0){
              setData(response.data);
            }
            else{
              setEmpty(true)
            }
          })
          .catch(error => {
            setError(true)
          });
      }, [empty,error]);
      const handleMessage = (profile) => {
        messageUser(profile)
        
      };
  if(empty){
    return<div className="cent"><p>You have no dating relationship</p></div>
  }  
  if(error){
    return<div className="cent"><p>Some thing went wrong please refresh page</p></div>
  }  
  return (
    <div className='friend'>
        {isMessage?(<MessageProfile />):  
        (data.map((profile) => (
          <div className="carousel-box"  key={profile.id}>
            {/* <h4>{profile.full_name}</h4> */}
            <h3 className='profilename'>{profile.full_name.charAt(0).toUpperCase() + profile.full_name.slice(1)}</h3>
            <Slider {...setup}>      
              {profile.images.map((j,k) => (
                 <div style={{ width: 100, height: 100 }} key={k}>
                    <img src={`${basePhotoUrl}${j.Photo}`} alt={`Image ${k}`} style={{ width: '100%', height: '350px'}} />
                 </div>
              ))}
            </Slider>
            <div className='icondiv' onClick={()=>handleMessage(profile)}>
              <FontAwesomeIcon icon={faComment} className='custom-icon'/>
            </div>
          </div>
      )))}
    </div>  
  )
}

export default Friend