// import './imageupload.css'
// import React, { useState,useContext,useRef } from 'react';
// import AuthContext from '../context/AuthContext'

// const ImageUpload = () => {
//   const [selectedFile, setSelectedFile] = useState([]);
//   const {Imagedownload} = useContext(AuthContext)
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files;
//     setSelectedFile([...selectedFile, ...file]);
//     // setSelectedFile(file);
//   };
  
//   const handlePlusClick = () => {
//     fileInputRef.current.click();
//   };
//   const handleUpload = () => {
//     Imagedownload(selectedFile);
//   };

//   return (
//     <div className='imgupld'>
//       <div className='imgupldin'>
//         <div className='imgflex'>
//           <div className='imgcontainer' onClick={handlePlusClick}>
//             <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }}/>
//             <span className="plus-icon">+</span>
//           </div>
//           <div className='imgcontainer' onClick={handlePlusClick}>
//             <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }}/>
//             <span className="plus-icon">+</span>
//           </div>
//         </div>  
//         <div className='imgflex'>

//           <div className='imgcontainer' onClick={handlePlusClick}>
//             <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }}/>
//             <span className="plus-icon">+</span>
//           </div><div className='imgcontainer' onClick={handlePlusClick}>
//             <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }}/>
//             <span className="plus-icon">+</span>
//           </div>
//         </div>
//         <div className='imgflex'>
//             <button onClick={handleUpload}>Upload Image</button>  
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;

import './imageupload.css'
import React, { useState, useContext, useRef, useEffect } from 'react';
import AuthContext from '../context/AuthContext';


const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { Imagedownload } = useContext(AuthContext);
  const fileInputRefs = useRef([]);
  





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
    updatedSelectedFiles[index] = null; // Remove the selected file
    setSelectedFiles(updatedSelectedFiles);
    fileInputRefs.current[index].value = null;
  };
  const handleUpload = () => {
    Imagedownload(selectedFiles);
  };

  return (
    <div className='imgupld'>
      <div className='imgupldin'>
        <div className='imgflex'>
          {[0, 1, 2, 3].map((index) => (
            <div className={`imgcontainer ${index < 2 ? 'in-row' : 'next-row'}`} key={index}>
              <input type="file" onChange={(e) => handleFileChange(e, index)}
               ref={(el) => fileInputRefs.current[index] = el} style={{ display: 'none' }} />
              {selectedFiles[index] ? (
                 <div>
                  <img src={URL.createObjectURL(selectedFiles[index])} alt={`Selected Image ${index + 1}`} />
                 <button onClick={() => handleRemove(index)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                 </button>
               </div>
              ) : (
                <span className="plus-icon" onClick={() => handlePlusClick(index)}>+</span>
              )}
            </div>
          ))}
        </div>
        <div className='imgflex'>
          <button onClick={handleUpload}>Upload Image</button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

