import { useState } from "react";
import Editor from "../components/Editor";
const baseURL = import.meta.env.VITE_BASE_URL;
import { Navigate } from "react-router-dom";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const createPost = async (e) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    e.preventDefault();
    const response = await fetch(`${baseURL}/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  };
  const cancelCreate = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createPost} className="max-w-xl mx-auto block bg-white border border-gray-200 rounded-lg shadow mt-8 p-4 sm:p-6 lg:p-8 text-slate-950">
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={title}
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Summary
        </label>
        <input
          type="text"
          name="summary"
          value={summary}
          placeholder="summary"
          onChange={(e) => setSummary(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="user_avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload profile picture
        </label>
        <input
          className="shadow-sm mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFiles(e.target.files)}
        />

        <Editor
          value={content}
          onChange={setContent}
          className="mb-4 block text-sm font-medium leading-10 text-gray-900"
        />
      </div>
      <button
        type="submit"
        className="w-full text-yellow-50 hover:bg-teal-800 bg-teal-600 focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
      >
        Create Post
      </button>
      <button
        type="button"
        onClick={cancelCreate}
        className="w-full text-yellow-50 hover:bg-gray-800 bg-gray-400 focus:ring-4 focus:outline-none shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Cancel
      </button>
    </form>




  );
};
export default CreatePage;
