import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import useAxios from '../utils/useAxios';
const swal = require('sweetalert2')
const AuthContext = createContext();


export default AuthContext

export const AuthProvider = ({ children }) => {
    const axiosInstance = useAxios(); 
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    

    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );

    const [profileuser, setProfile] = useState(false);
    const [picture, setPicture] = useState(false);
    const [deteile, setDeteile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rerender, setRerender] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isFactive, setIsFactive] = useState(false);
    const [isMactive, setIsMactive] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isMatch, setIsMatch] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [MsgBoolean, setMsgboolean] = useState(false);
    const [chat_text, setChat] = useState('');
    const [verUser, setverUser] = useState('');

    // const [socket, setSocket] = useState(null);
    const[roomName, setRoom]=useState('');
    const [chatsocket,setChatSocket ] = useState(null);
    const [visible, setVisible] = useState(false)

    
    const [MsgInfo, setMsgInfo] = useState([]);

    const history = useNavigate();
    const friendUser =()=>{
        setIsFriend(true)
        setProfile(false)
        setIsActive(false)
        setIsFactive(true)
        setIsMessage(false)
        setIsMatch(false)


    }
    const renderUser =()=>{
        setIsFriend(false);
        setProfile(false);
        setRerender(!rerender);
        setIsActive(false);
        setIsFactive(false)
        setIsMessage(false)
        setIsMatch(false)


    }
    const messageUser = (profile) => {
        setMsgInfo(profile)
        setIsMessage(true)
        setIsFactive(true)
        setIsFriend(false);
        setProfile(false);
        setIsActive(false);
        setIsMatch(false)



    } 
    const profileUser =()=>{
        setProfile(true);
        setIsActive(true)
        setIsFriend(false)
        setIsFactive(false)
        setIsMatch(false)


    }
    const ProfileSetup =()=>{
        setPicture(false);
        setDeteile(false);
    } 
    const pictureSetup =()=>{
        setDeteile(false);
        setPicture(true);
    } 
    const deteileSetup =()=>{
        setPicture(false);
        setDeteile(true);
    } 

 
    const send_message = async (chat_text,sender_id,reciever_id)=>{
        // const response = await fetch("http://127.0.0.1:8000/api/send_chatMsg/",{
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({chat_text,sender_id,reciever_id}),
        // })

        // if (response.status === 200){
        //     console.log('success');
        //     setMsgboolean(!MsgBoolean)
        //     setChat('')
        // }
        // else{
        //     console.log('fail')
        // }
        const response= await axiosInstance.post('/send_chatMsg/',{
            headers: {
                    "Content-Type": "application/json",
                    },
            body: JSON.stringify({chat_text,sender_id,reciever_id})

        })
        .then((response)=>{
            if (response.status === 201) {
                console.log('chat send successfully');
                    // history('/home');
                setMsgboolean(!MsgBoolean)
                setChat('')
            } else {
                    console.error('Image upload failed');
                }
        })
        .catch ((error)=> {
                 console.error('Image upload error:', error);
            }) 


    }
    const Imagedownload = async (selectedFile) => {
        const formData = new FormData();
        for (let i = 0; i < selectedFile.length; i++) {
          formData.append(`image${i + 1}`, selectedFile[i]); 
        }
        formData.append('id', user.user_id);
        try {
        //   const response = await fetch('http://localhost:8000/api/upload_image/', {
        //     method: 'POST',
        //     body: formData
        //   });
        //   if (response.status === 201) {
        //     console.log('Image uploaded successfully');
        //     history('/home');
        //   } else {
        //     console.error('Image upload failed');
        //   }

            const response= await axiosInstance.post('/imageManage/', formData)
            .then((response)=>{
                if (response.status === 201) {
                    console.log('Image uploaded successfully');
                    history('/api/home');
                } else {
                    console.error('Image upload failed');
                }
            })
            .catch ((error)=> {
                 console.error('Image upload error:', error);
            }) 
        } catch (error) {
          console.error('Image upload error:', error);
        }
      };



      
          
    const createProfile = async(full_name,height,weight,gender,Date)=>{
        const birth=Date.toISOString().split('T')[0];
        const id=user.user_id
        var data={full_name,height,weight,birth,gender,id};
        console.log(data)

        const response = await axiosInstance.post("/profileManage/", data)
        .then((response)=>{
          if (response.status === 201) {
            console.log('success');
            history('/api/image')
          } else {
            console.log('fail');
          }

        })
        .catch ((error)=> {
          console.error('error:', error);
        })
        // const response = await fetch("http://127.0.0.1:8000/api/create_profile",{
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({full_name,height,weight,birth,gender,id}),

        // })
        // const data = await response.json()
        // // console.log(data);

        // if (response.status === 201){
        //     console.log('success')
        //     history('/image')
        // }
        // else{
        //     console.log('fail')
        // }
    }

    const Forgot = async(email)=>{
        const response = await fetch("http://127.0.0.1:8000/api/forgot",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user:email}),

        })
        const data = await response.json()
        console.log(data);

        if (response.status === 200){
            console.log('success')
            swal.fire({
                title: `Email send to ${email}`,
                icon: "success",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            history('/api/')
        }
        else{
            swal.fire({
                title: "Email not exixt try againe ",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            console.log('fail')
        }
    }
    
    const verifyotp = async(verifyOTP,email)=>{
        console.log(verifyOTP,email)
        const response = await fetch("http://127.0.0.1:8000/api/verifyotp",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({verifyOTP,email}),

        })
        const data = await response.json()
        console.log(data);
        if (response.status === 200){
            console.log('success')
            console.log(verUser)

            setAuthTokens(verUser);
            const decodUser = jwt_decode(verUser.access);
            setUser(decodUser);
            localStorage.setItem("authTokens", JSON.stringify(verUser));
            history('/api/character')
        }
        else{
            console.log('fail')
        }
    }




    const loginUser = async (email, password) => {
        try {
            const tokenResponse = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
    
            const tokenData = await tokenResponse.json();
            // console.log(tokenData);
            
            if (tokenResponse.status === 200) {
                const decodedUser = jwt_decode(tokenData.access);
                if (!decodedUser.verified) {
                    //  history(`/otp?email=${encodeURIComponent(decodedUser.email)}`);
                    
                    console.log(decodedUser.verified)
                    const mailResponse = await fetch("http://127.0.0.1:8000/api/SendParsel/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user: decodedUser.email
                        })
                    });
    
                    if (mailResponse.status === 200) {
                        console.log("Email sent successfully");
                        setverUser(tokenData)
                        history(`/api/otp?email=${encodeURIComponent(decodedUser.email)}`);
                    } else {
                        console.log("Email send failed");
                    }
                } else {
                    setAuthTokens(tokenData);
                    setUser(decodedUser);
                    localStorage.setItem("authTokens", JSON.stringify(tokenData));

                    console.log("Logged In");
                    history("/api/home");
                    swal.fire({
                        title: "Login Successful",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            } else {
                console.log(tokenResponse.status);
                console.log("there was a server issue");
                swal.fire({
                    title: "Username or password does not exist",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
    



    const  newPassword = async (id,password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/password", {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                id,password, password2
            })
        })
        const data = await response.json()
        console.log(data);

        if(response.status === 200){
            history("/api/")
            swal.fire({
                title: "Password change Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }
    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })
        if(response.status === 201){
            history("/api/")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        history("/api/")
        swal.fire({
            title: "YOu have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
        Forgot,
        newPassword,
        verifyotp,
        createProfile,
        Imagedownload,
        profileUser,
        profileuser,
        pictureSetup,
        picture,
        deteileSetup,
        deteile,
        renderUser,
        rerender,
        isActive,
        friendUser,
        isFriend,
        isFactive,
        setIsActive,
        setIsFactive,
        setIsMactive,
        isMactive,
        messageUser,
        isMessage,
        setIsMessage,
        MsgInfo,
        send_message,
        MsgBoolean,
        chat_text,
        setChat,
        roomName,
        setRoom,
        setIsMatch,
        isMatch,
        ProfileSetup,
        chatsocket,
        setChatSocket,
        visible, 
        setVisible,

    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}
