/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const baseURL = import.meta.env.VITE_BASE_URL;

const Post = ({ _id, cover, title, author, createdAt, summary }) => {
  const formattedDate = format(new Date(createdAt), 'dd MM yyyy HH:MM');

  return (
    <>
      <div className="flex mt-6 items-center justify-center">
        <div className="relative flex w-full max-w-[48rem] flex-row rounded-xl text-gray-700 shadow-md">
          <div className="relative m-0 w-2/6 shrink-0 overflow-hidden rounded-xl rounded-r-none  text-gray-700">
            <Link to={`/post/${_id}`}>
              <img
                src={`${baseURL}/${cover}`}
                alt="image"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
          <div className="p-6">
            <h4 className="mb-2 block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
              {title}
            </h4>
            <p className="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
              {summary} <br></br> {author.username} <br></br> {formattedDate}
            </p>
          </div>
        </div>
      </div>


    </>
  );
};

export default Post;

