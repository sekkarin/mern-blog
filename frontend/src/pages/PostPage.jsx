/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_BASE_URL;

const PostPage = () => {
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();


  useEffect(() => {
    fetch(`${baseURL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Post deleted successfully!");
        navigate("/");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  // ฟังก์ชันนี้ใช้ในการแสดงกล่องข้อความยืนยันการลบโพสต์
  const deleteConfirmation = () => {
    Swal.fire({
      title: 'Are you sure you want to delete this post?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: 'warning', // เพิ่มไอคอนเตือนเมื่อลบ
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้าผู้ใช้กดตกลงในกล่องยืนยัน
        handleDelete();
      } else {
        // ถ้าผู้ใช้กดยกเลิก
        Swal.fire({
          title: 'The post was not deleted.',
        });
      }
    });
  };


  if (!postInfo) return "";

  return (
    <div className="post-page max-w-2xl mx-auto my-8 p-4 rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-black text-center">{postInfo.title}</h1>

      <div className="image mt-6">
        <Link to="/">
          <img
            src={`${baseURL}/${postInfo.cover}`}
            alt={postInfo.title}
            className="rounded"
          />
        </Link>
      </div>

      <div
        className="content mt-6 text-gray-800"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      >
      </div>

     
      <time className="text-gray-600">
        {format(new Date(postInfo.createdAt), "dd MMMM yyyy HH:MM")}
      </time>
      <div className="text-gray-700 mt-2">
        @ by {postInfo.author.username}
      </div>

      {userInfo?.id === postInfo.author._id && (
        <div className="edit-row mt-4">
          <Link
            className="edit-btn flex items-center text-blue-500"
            to={`/edit/${postInfo._id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit This post
          </Link>
          <Link
            className="delete-btn flex items-center text-blue-500"
            to="#"
            onClick={deleteConfirmation}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Delete This post
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostPage;
