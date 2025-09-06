import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({value, onChange, placeholder,label,type}) => {
   
     const [showPassword, setShowPassword] = useState(false);

      const toggleShowPassword = () => {
        setShowPassword(!showPassword);         
        }
      
  return (
    <div className='w-full mb-4'>
 
       <label className='text-sm text-gray-700 mb-2 block'>
        {label}     
        </label>

        <div 
        className='relative w-full mb-4'>

        <input
        value={value}   
        onChange={onChange}
        type={type === 'password' && showPassword ? 'text' : type}  
        placeholder={placeholder}
        className='w-full px-4 py-2 border border-gray-300 rounded-md ' />    

      

        {/* {type === 'password' && (
        <button             
        type='button'
        onClick={toggleShowPassword}            
        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
          {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />} 
        </button>
        )} */}

        </div>
      
    </div>
  )
}

export default Input
