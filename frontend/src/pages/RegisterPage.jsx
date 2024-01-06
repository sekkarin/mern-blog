/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
const baseURL = import.meta.env.VITE_BASE_URL;

const RegisterPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const register = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseURL}/register`, {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers:{"Content-Type":"application/json"},
    });
    if(response.status === 200){
      alert("Registration successful !")
    } else {
      alert("Registration failed !")
    }
  };

  return (
    <form className="max-w-md mx-auto block bg-white border border-gray-200 rounded-lg shadow mt-20 p-8" onSubmit={register}>
      <div className='flex items-center justify-center' >
        <h2 className="text-2xl font-semibold mb-5">
          <span className="text-gray-900 dark:text-white ">Create an account</span>
          <span className="text-teal-600"> SE BLOG</span>
        </h2>
      </div>


      <div className="relative mb-5">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">
          Username
        </label>
        <input
          type="text"
          name="username"
          className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 dark:text-white dark:border-gray-600"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>


      <div className="relative mb-5">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-500 dark:text-white">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 dark:text-white dark:border-gray-600 "
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full text-yellow-50 hover:bg-teal-800 bg-teal-600 focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
      >
        Register
      </button>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
      Already have an account?<a href="/login" className="text-teal-600 hover:underline dark:text-black"> Login here.</a>
      </div>
    </form>
  )
}

export default RegisterPage;