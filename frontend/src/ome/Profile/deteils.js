import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import AuthContext from '../../context/AuthContext';
import { Outlet } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import useAxios from '../../utils/useAxios';
import 'react-datepicker/dist/react-datepicker.css';

function Deteils() {
  const basePhotoUrl = 'http://127.0.0.1:8000';
  const [data, setData] = useState([]);
  const [edit, setedit] = useState(false);
  const [success, setSuccess] = useState(false);

  const [Fullname, setFullname] = useState('');
  const [Height, setHeight] = useState('');
  const [Weight, setWeight] = useState('');
  const [Gender, setGender] = useState('');
  const [id, setId] = useState('');

  const [Dated, setDate] = useState(null);
  // const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isvalid, setIsvalid] = useState(true);
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();

  const CharacterChange = event => {
    const { name, value } = event.target;
    if (name === 'Fullname') setFullname(value);
    else if (name === 'Height') setHeight(value);
    else if (name === 'Weight') setWeight(value);
    else if (name === 'Gender') setGender(value);
  };

  const DateChange = date => {
    setDate(date);
  };

  const toggleEdit = () => {
    setedit(prevEdit => !prevEdit); // Toggle edit mode
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (Fullname === '') {
      setError('Fields must not be empty!');
      setIsvalid(false);
    } else {
      const birth = Dated.toISOString().split('T')[0];

      // try {
        // const response = await fetch("http://127.0.0.1:8000/api/edit_profile", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ Fullname, Height, Weight, Gender, birth, id }),
        // });
        const bd= { Fullname, Height, Weight, Gender, birth, }
        console.log(bd)
        const response = await axiosInstance.put("/profileManage/", bd)
        .then((response)=>{
          if (response.status === 201) {
            console.log('success');
            setedit(false);
            setSuccess(!success)
          } else {
            console.log('fail');
          }

        })
        .catch ((error)=> {
          console.error('error:', error);
        })
        
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('http://localhost:8000/api/get_PersonalDeteileData/', {
        //   params: {
        //     user: user.user_id
        //   }
        // });
        const response = await axiosInstance.get('/profileManage/');
        if (response.data && response.data.length > 0) {
          setData(response.data);
          const profile = response.data[0];
          setFullname(profile.full_name);
          setHeight(profile.height);
          setWeight(profile.weight);
          setGender(profile.gender);
          setDate(new Date(profile.birth));
          setId(profile.id);
        }
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };

    fetchData();
  }, [user.user_id,success]);

  const renderEditForm = () => (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Edit character</h1>
        {error && <p className='characterP'>{error}</p>}
        <input
          type='text'
          name='Fullname'
          placeholder='Full name'
          value={Fullname}
          className={!isvalid ? 'error' : ''}
          onChange={CharacterChange}
          id='elem'
        />
        <input type='text' name='Height' placeholder='Height' value={Height} className={!isvalid ? 'error' : ''}  onChange={CharacterChange} id='elem'></input>
        <input type='text' name='Weight' placeholder='Weight' value={Weight} className={!isvalid ? 'error' : ''}  onChange={CharacterChange} id='elem'></input>
        <div className='rdi'>
                        <label>
                            <input type="radio" value="Male" name='Gender' checked={Gender === 'Male'} onChange={CharacterChange}/>
                            Male
                        </label>
                        <label>
                            <input type="radio" value="Female" name='Gender' checked={Gender === 'Female'} onChange={CharacterChange}/>
                            Female
                        </label>
                        <label>
                            <input type="radio" value="Trans" name='Gender' checked={Gender === 'Trans'} onChange={CharacterChange}/>
                            Trans
                        </label>
        </div>
        <div className='rdi'>
                        <h4>Date of birth </h4>
                        <DatePicker selected={Dated} onChange={DateChange} dateFormat="yyyy-MM-dd" name='Date' value={Dated}/>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );

  const renderUserProfile = () => (
    <div>
      {data.map((profile) => (
        <div key={profile.id}>
          <div>
            {(profile.full_name === '' || profile.gender === '') ? (
              <p onClick={toggleEdit}>
                Your profile is not completed, please click to edit
              </p>
            ) : (
              <div style={{ paddingTop: '10px' }}>
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
                       </tr>
                       <tr>
                         <td>Date of birth</td>
                         <td>{profile.birth}</td>
                       </tr>
                     </tbody>
                </table>
                <p onClick={toggleEdit}>Edit</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {edit ? renderEditForm() : renderUserProfile()}
    </div>
  );
}

export default Deteils;
