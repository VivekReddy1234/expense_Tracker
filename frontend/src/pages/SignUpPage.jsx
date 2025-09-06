import AuthLayout from '../components/layouts/AuthLayout'
import Input from '../components/Input'
import { useState } from 'react'
import { validateEmail } from '../utils/helper'
import { useNavigate } from 'react-router-dom'
import ProfilePhotoSelector from '../components/ProfilePhotoSelector'
import axiosInstance from '../utils/axiosInstance'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'

import uploadImage from '../utils/uploadimage'

const SignUpPage = () => {

  const { updateUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {

    e.preventDefault();   
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if (!password) {
      alert('Please enter your password');
      return;
    }
    if (!fullName) {
      alert('Please enter your full name');
      return;
    }

    try{
      let profileImageUrl = "";
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);

        profileImageUrl = imgUploadRes.imageUrl || "";
      }
       
        
      const response = await axiosInstance.post('/api/v1/auth/signup',{
        fullName,
        email,
        password,
        profileImageUrl
      });
      const {token , user } = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(user);
        alert('Sign up successful');
      } else{
        alert('Sign up failed');
      }

    }
    catch(error){
      console.log(error);
      alert('Something went wrong');
    }
   
   

    navigate('/login');
  };

  return (
    <AuthLayout>
    <div className='lg:w-[100%] h-auto  md:h-full mt-10 md:mt-0  w-full mx-auto flex flex-col justify-center items-center '>

     <h3 className=' text-xl font-semibold text-black'>Create An Account</h3>

     <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please fill in the details below to create an account</p>

      <form onSubmit={handleSignUp} className='w-full max-w-sm'>  

       <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}></ProfilePhotoSelector>  

        <Input
          value={fullName}    
          onChange={(e) => setFullName(e.target.value)}
          type='text'           
          placeholder='John Doe'
          label='Full Name'
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'  
          placeholder="Enter your email"
          label='Email'
        />  
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Enter your password'
          label='Password'                         
          />
        {/* <div className='mb-4'>
          <label className='text-sm text-gray-700 mb-2 block'>Profile Picture</label>
          <input      
            type='file'
            accept='image/*'
            onChange={(e) => setProfilePic(e.target.files[0])}
            className='w-full px-4 py-2 border border-gray-300 rounded-md'
          />  
        </div> */}


        <button
          type='submit'     
          className='w-full bg-purple-600 text-white py-2 rounded-md mt-4 hover:bg-purple-700 transition-colors duration-300'>
          Sign Up 
        </button>

        <p className='text-xs text-gray-500 mt-4'>Already have an account? <a href='/login' className='text-purple-600 hover:underline'>Login</a></p>
          

          </form>
  
    </div>
  </AuthLayout>
  )
}

export default SignUpPage
