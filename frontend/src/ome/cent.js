import './cent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AuthContext from '../context/AuthContext'
import Roleprofile from './Profile/profile'
import Friendprofile from './Profile/friend'
import MessageProfile from './Profile/message'
import { Outlet,useLocation } from 'react-router-dom';
import Match from './match';
import useAxios from '../utils/useAxios';
import love from "../love.png"
import close from "../close.png"
const swal = require('sweetalert2')

// '/close.png'


function Cent() {
  const basePhotoUrl = 'http://127.0.0.1:8000'; 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [autoplay, setAutoplay] = useState(false);
  // const [hovered, setHovered] = useState(false);
  const [acceptBtn, setAcceptBtn] = useState(false);
  const {profileuser } = useContext(AuthContext);
  const {rerender } = useContext(AuthContext);
  // const {isFriend } = useContext(AuthContext);
  const {isMessage } = useContext(AuthContext);
  // const {isMatch } = useContext(AuthContext);
  const { setIsActive } = useContext(AuthContext);
  const { setIsFactive } = useContext(AuthContext);
  const { setIsMactive } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const {setIsMessage } = useContext(AuthContext);
  // const { get } = useAxios(); 
  // const {authTokens } = useContext(AuthContext);
  const axiosInstance = useAxios();
  // console.log('the token',authTokens)
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 4000, 
    autoplay: autoplay, 
    autoplaySpeed: 5000, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
  };
  const handleMouseEnter = () => {
    // setHovered(true);
    setAutoplay(!autoplay);
  };

  const handleMouseLeave = () => {
    // setHovered(false);
    setAutoplay(!autoplay);
  };
  
  
  const sendRequest = (sender,reciever) => {
    // console.log(sender)
    // console.log(reciever)
    axiosInstance.post('/couple_Send_request/', {sender,reciever})
      .then((response) => {
        if(response.status==204){
          swal.fire({
            title: 'You are already send a request',
            icon: "error",
            toast: true,
            timer: 2500,
            position: 'center',
            timerProgressBar: true,
            showConfirmButton: false,
        });       
        }
        else{
        console.log('Love request sent successfully');
        }
      })
      .catch((error) => {
        console.error('Error sending love request:', error);
      });
  };

  const acceptRequest = (sender,reciever) => {
    axiosInstance.post('/couple_Accept_request/', {sender,reciever})
      .then((response) => {
        console.log('Love request accepted successfully');
        setAcceptBtn(!acceptBtn)

      })
      .catch((error) => {
        console.error( error);
      });
  };
  const rejectRequest = (sender,reciever) => {
    axiosInstance.post('/couple_Reject_request/', {sender,reciever})
      .then((response) => {
        console.log('Love request rejected successfully');
        setAcceptBtn(!acceptBtn)
      })
      .catch((error) => {
        console.error( error);
      });
  };
  
  useEffect(() => {
    setIsActive(false)
    setIsFactive(false)
    setIsMactive(false)
    setIsMessage(false)
    
    // axios.get('http://localhost:8000/api/get_data/',{
     axiosInstance.get('/get_data/',{
      // params: {
      //   user: user.user_id
      // },  
      })
      .then(response => {
          console.log(response.data)          
          setData(response.data)
          setLoading(false);

        })
      .catch(error => {
        setError(`Error fetching data: ${error.message}`);
        setLoading(false);
      });
  },[acceptBtn,rerender]);

  if (loading) {
    return <div className='cent'>Loading...</div>; 
  }

  if (error) {
    return <div className='cent'>{error}</div>;
  }

  return (
    <div className="cent">
        {/* {console.log('is it',isMessage)} */}
        {
        // isMessage?(<MessageProfile />):
        (data.map((profile) => (
          <div className="carousel-container"  key={profile.id}
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <h3 className='profilename'>{profile.full_name.charAt(0).toUpperCase() + profile.full_name.slice(1)}</h3>
            <Slider {...settings}>      
              {profile.images.map((j,k) => (
                 <div style={{ width: 100, height: 100 }} key={k}>
                   {/* {console.log(`${basePhotoUrl}${j.Photo}`)} */}
                    <img src={`${basePhotoUrl}${j.Photo}`} alt={`Image ${k}`} style={{ width: '100%', height: '350px'}} />
                 </div>
              ))}
            </Slider>
            <div className='clk'>
              {profile.couple ?<button id='acptbtn' onClick={()=>acceptRequest(user.user_id,profile.id)}>Accept</button> :<button className='btm' onClick={()=>sendRequest(user.user_id,profile.id)}>
                <img src={love} alt='icon'></img>{profile.sended&&<FontAwesomeIcon icon={faCheck} className="customOk" />}                
                </button>}

            </div>
            <div className='clk1'>
                <button className='btm1' onClick={()=>rejectRequest(user.user_id,profile.id)}><img src={close} alt='icon'></img></button>                           
            </div>
          </div>
      )))}
    </div>   
          
  );
}

export default Cent;
