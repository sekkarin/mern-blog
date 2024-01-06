/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';

const baseURL = import.meta.env.VITE_BASE_URL;

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');


  useEffect(() => {
    const fetchPost = async () => {
      try {
        // ส่ง HTTP GET request ไปยัง API เพื่อดึงข้อมูลโพสต์ตาม ID
        const response = await fetch(`${baseURL}/post/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // แปลง response เป็น JSON
        const data = await response.json();
        // อัปเดต state ด้วยข้อมูลที่ได้จาก API
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching post:', error.message);
      }
    };
    fetchPost();
  }, [id]);

  const updatePost = async (e) => {
    // ป้องกันการโหลดหน้าใหม่เมื่อส่งฟอร์ม
    e.preventDefault();

    // สร้าง FormData เพื่อเก็บข้อมูลที่จะส่งไปยัง API
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.append('file', file[0]); // แนบไฟล์ (cover image)

    // ส่ง HTTP PUT request ไปยัง API endpoint สำหรับการอัปเดตโพสต์
    const res = await fetch(`${baseURL}/posts/${id}`, {
      method: 'PUT',
      body: data, // ใช้ FormData เป็น body ของ request
      credentials: 'include', // รวมข้อมูลการรับรองตัวตนใน request
      headers: {
        Accept: 'application/json', // ระบุประเภทข้อมูลที่ต้องการใน response
      },
    });
    if (res.ok) {
      navigate('/');
    }
  };

  const cancelEdit = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel editing? Your changes will not be saved.');

    if (confirmCancel) {
      navigate('/');
    }
  };

  return (
    <form
      onSubmit={updatePost}
      className="max-w-xl mx-auto block bg-white border border-gray-200 rounded-lg shadow mt-8 p-4 sm:p-6 lg:p-8 text-slate-950"
    >
      {/* Title Input */}
      <div className="mb-5">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow-sm mb-6 bg-gray-50 border border-gray-300
          text-gray-900 text-sm rounded-lg focus:ring-blue-500 
          focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        />
      </div>

      {/* Summary Input */}
      <div className="mb-5">
        <label htmlFor="summary" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Summary
        </label>
        <input
          type="text"
          name="summary"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="shadow-sm mb-6 bg-gray-50 border border-gray-300
            text-gray-900 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"

        />
      </div>

      {/* File Input */}
      <div className="mb-5">
        <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload profile picture
        </label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFile(e.target.files)}
          className="shadow-sm mb-6 bg-gray-50 border border-gray-300
            text-gray-900 text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
            dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"

        />
      </div>

      {/* Editor Component */}
      <Editor
        value={content}
        onChange={setContent}
        className="mb-4 block text-sm font-medium leading-10 text-gray-900"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-3 text-yellow-50 hover:bg-teal-800 bg-teal-600 focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
      >
        Edit Post
      </button>
      <button
        type="button"
        onClick={cancelEdit}
        className="w-full text-yellow-50 hover:bg-gray-800 bg-gray-400 focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Cancel Edit
      </button>
    </form>
  );
};

export default EditPage;
