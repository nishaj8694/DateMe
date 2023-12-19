import React, { useState, useEffect, useContext ,useRef } from 'react';
import axios from 'axios'; // Import axios
import  './picture.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';
import useAxios from '../../utils/useAxios';

const swal = require('sweetalert2')

function Picture() { 

  const basePhotoUrl = 'http://127.0.0.1:8000';
  const [data, setData] = useState([]);
  const [change, setChange] = useState(false);
  const { user } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRefs = useRef([]);
  const axiosInstance = useAxios();
    
  const handleFileChange = (e, index) => {
      const files = Array.from(e.target.files);
      const updatedSelectedFiles = [...selectedFiles];
      updatedSelectedFiles[index] = files[0];
      setSelectedFiles(updatedSelectedFiles);
    };
  
  const handlePlusClick = (index) => {
      fileInputRefs.current[index].click();
    };
  
  const handleRemove = (index) => {
      const updatedSelectedFiles = [...selectedFiles];
      updatedSelectedFiles[index] = null; 
      setSelectedFiles(updatedSelectedFiles);
      fileInputRefs.current[index].value = null;
    };
    
  const handleUpload = async(selectedFile) => {
        const formData = new FormData();

        for (let i = 0; i < selectedFile.length; i++) {
          formData.append(`image${i + 1}`, selectedFile[i]);
        }
    
        const response= await axiosInstance.post('/imageManage/', formData)
            .then((response)=>{
              if (response.status === 201) {
                console.log('Image uploaded successfully');
                setChange(!change)
              } else {
                console.error('Image upload failed');
              }
            })
          .catch ((error)=> {
          console.error('Image upload error:', error);
        })
    };
  
  useEffect(() => {
          axiosInstance.get('/imageManage/',)
          .then(response => {
              setData(response.data);
            })
          .catch(error => {
             console.log('image error')
           });
  }     , [user.user_id,change]);


  const deleteimage = (id) => {
    const swalWithBootstrapButtons = swal.mixin({
         customClass: {
           confirmButton: 'btn btn-success',cancelButton: 'btn btn-danger'
         },
         buttonsStyling: false
        })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    })
    .then((result) => {
      if (result.isConfirmed) { 
        axiosInstance.delete(`/imageManage/${id}`)
        .then((response) => {
          if(response.status==200){
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            setChange(!change)

          }
    })
    .catch((error) => {
          console.error( error);
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        });
    }  
      
    if (result.dismiss === swal.DismissReason.cancel){
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })

  };

  return (
    <div className='picturediv'>
      {data.length < 4 ? (
      <>
        <p style={{fontSize:'large', backgroundColor:'rgba(0, 0, 0, 0.3)', width:'85%' ,padding:'10px'}}>Add Images </p>
        <div className='igflex'>

          {[...Array(4 - data.length)].map((_, idx) => (
            <div className={`igcontainer ${idx < 2 ? 'inrow' : 'nextrow'}`} key={idx}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, idx)}
                ref={(el) => fileInputRefs.current[idx] = el}
                style={{ display: 'none' }}
              />
              {selectedFiles[idx] ? (
                <div>
                  <img src={URL.createObjectURL(selectedFiles[idx])} alt={`Selected Image ${idx + 1}`} />
                  <button onClick={() => handleRemove(idx)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <span className="plusicon" onClick={() => handlePlusClick(idx)}>+</span>
              )}
            </div>
          ))}
          </div>  
          <div className='igflex'>
            <button onClick={()=>{handleUpload(selectedFiles)}}>Upload Image</button>
          </div>
        

        </>
      ) : null}
      <p style={{fontSize:'large' , backgroundColor:'rgba(0, 0, 0, 0.3)', width:'85%' ,padding:'10px' }}>My Images </p>
      {data.map((profile, index) => (
        <div className='pictureShow' key={profile.id}>
          <span style={{position:'absolute',right:'2%', top:'2%' }} 
              onClick={()=>deleteimage(profile.id)}><FontAwesomeIcon icon={faTrash} />
          </span>
          <img
            src={`${basePhotoUrl}${profile.image}`}
            alt={`Image ${profile.id}`}
            style={{ width: '100%', height: '100%' }}

          />
        </div>
      ))}
    </div>
  );
  



}

export default Picture; 
