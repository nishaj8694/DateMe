import './home.css';
import Left from './left';
import Cent from './cent';
import Right from './right';
import Header from './header';
import { Outlet,Link } from 'react-router-dom';
import { useEffect, useContext, } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaTimes } from 'react-icons/fa';

function Home() { 
  const { logoutUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isActive } = useContext(AuthContext);
  const { isFactive } = useContext(AuthContext);
  const { isMactive } = useContext(AuthContext);
  const { visible,setVisible } = useContext(AuthContext);


  useEffect(() => {
    if (!user) {
      navigate("/"); 
    }
  }, [user, navigate]);

  return (
    <div className="home">
      <div className={visible ?'offcanvasBodyactive':'offcanvasBody'}>
          <button onClick={()=>setVisible(false)} id='closeicon'><FaTimes /> </button>
          <div>
           <p><Link to='/api/home' className='leftarrow'>Home</Link></p>           
           <p><Link to='/api/home/Match' className={`leftarrow ${isMactive ? 'active' : ''}`}>Match</Link></p>
           <p><Link to='/api/home/Profile' className={`leftarrow ${isActive ? 'active' : ''}`}>Profile</Link></p>
           <p><Link to='/api/home/Friends' className={`leftarrow ${isFactive ? 'active' : ''}`}>Friends</Link></p>
           <button onClick={logoutUser} id='logout'>LOGOUT</button>
        </div>    
      </div>
      <Header />
      <div className='container'>
        <div className='left'>
           <h3 id='loggeduser'>Logged User : {user.username.charAt(0).toUpperCase() + user.username.slice(1)}</h3> 
           <p><Link to='/api/home' className='leftarrow'>Home</Link></p>           
           <p><Link to='/api/home/Match' className={`leftarrow ${isMactive ? 'active' : ''}`}>Match</Link></p>
           <p><Link to='/api/home/Profile' className={`leftarrow ${isActive ? 'active' : ''}`}>Profile</Link></p>
           <p><Link to='/api/home/Friends' className={`leftarrow ${isFactive ? 'active' : ''}`}>Friends</Link></p>
           <button onClick={logoutUser} id='logout'>LOGOUT</button>
        </div> 
        <div className='cent'>
          <Outlet />
        </div>      
        <div className='right'>
          <Right />
        </div>      

        {/* <Left /> */}
        {/* <Cent /> */}
      </div>
    </div>
  );
}

export default Home;
