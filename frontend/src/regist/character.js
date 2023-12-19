
import React, { useState,useContext } from 'react';
import './character.css';
import { Navigate, useNavigate } from 'react-router-dom';
import Home from '../ome/home'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from '../context/AuthContext'



const Character=()=> {
        const [Fullname, setFullname]= useState('');
        const [Height, setHeight]= useState('');
        const [weight, setWeight]= useState('');
        const [Gender, setGender] = useState('Male');
        const [Date, setDate] = useState(null);

        const {createProfile} = useContext(AuthContext)

        const navigate= useNavigate();
        const [error, setError]= useState('');
        const [isvalid, setIsvalid]= useState(true);

        
        const CharacterChange = event => {
            const { name, value } = event.target;
            if (name === 'Fullname') setFullname(value);
            else if (name === 'Height') setHeight(value);
            else if (name === 'weight') setWeight(value);
            else if (name === 'Gender') setGender(value);


        };
        const DateChange = date => {
            setDate(date);
        };
    
        const handleSubmit = async event => {
            event.preventDefault();
            if(Fullname === '' ) {
                setError('Fields must not be empty !');
                setIsvalid(false);
            }else {
                  createProfile(Fullname,Height,weight,Gender,Date)
            }
        };      
        return (
            <div className="Character">
                <form onSubmit={handleSubmit}>
                    <h1>character</h1>
                    {error && <p className='characterP'>{error}</p>}
                    <input type='text' name='Fullname' placeholder='Full name' value={Fullname} className={!isvalid ? 'error' : ''}  onChange={CharacterChange} id='elem'></input>
                    <input type='text' name='Height' placeholder='Height' value={Height} className={!isvalid ? 'error' : ''}  onChange={CharacterChange} id='elem'></input>
                    <input type='text' name='weight' placeholder='weight' value={weight} className={!isvalid ? 'error' : ''}  onChange={CharacterChange} id='elem'></input>
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
                        <DatePicker selected={Date} onChange={DateChange} dateFormat="yyyy-MM-dd" name='Date'/>
                        {/* {Date && (<p>Selected Date: {Date.toDateString()}</p>)} */}
                    </div>
                    <button type='submit' >Submit</button>  
                </form>     
            </div>
        );
}
export default Character;
