import { GlobalStateContext } from "./Global_Context";
import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";

const GlobalMethodsContext = createContext();

const GlobalMethodsProvider = ({ children }) => {
  const { user, token, setToken, setUser } =
    useContext(GlobalStateContext);

   // Load token and user data from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setToken, setUser]);

  // Update local storage whenever token or user changes
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const baseURL = "http://localhost:8000/api";

  const SignIn = async (values) => {
    try {
      const url = `${baseURL}/user/login`;
      const response = await axios({
        method: "POST",
        url,
        data: values,
      });

      // setUserName(response.data.user.name);
      setToken(response.data.access_token);
      console.log("user data in SignIn: ", response.data.user);
      setUser(response.data.user);
      return response;
    } catch (error) {
      console.log(error.message);
      return 401;
    }
  };

  const SignUp = async (values) => {
    try {
      const url = `${baseURL}/user/register`;
      const response = await axios({
        method: "POST",
        url,
        data: values,
      });

      return response.status;
    } catch (error) {
      console.log(error.message);
      return 500;
    }
  };

  const AllPosts = async () => {
    try {
      const url = `${baseURL}/posts`; 
      const response = await axios({
        method: "GET",
        url,
      }); 
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return 500;
    }
  };


  // NEW: Add comment to a post
  const addComment = async (postId, commentData) => {
    try {
      const url = `${baseURL}/posts/${postId}/comment`;
      const response = await axios({
        method: "POST",
        url,
        data: commentData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // or your token storage
        },
      });
      console.log("Comment added:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error adding comment:", error.message);
      return { error: error.message, status: 500 };
    }
  };

  // NEW: Like a post
  const likePost = async (postId) => {
    try {
      const url = `${baseURL}/posts/${postId}/like`;
      const response = await axios({
        method: "POST",
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("Post liked:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error liking post:", error.message);
      return { error: error.message, status: 500 };
    }
  };

  const unlikePost = async (postId) => {
    try {
      const url = `${baseURL}/posts/${postId}/like`;
      const response = await axios({
        method: "POST",
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error unliking post:", error.message);
      return { error: error.message, status: 500 };
    }
};

  // Save a post
const savePost = async (postId) => {
  try {
    const url = `${baseURL}/user/save-photo`;
    const response = await axios({
      method: "PUT",
      url,
      data: { postId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("Post saved:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error saving post:", error.message);
    return { error: error.message, status: 500 };
  }
};

// Unsave a post
const unsavePost = async (postId) => {
  try {
    const url = `${baseURL}/user/unsave-post`;
    const response = await axios({
      method: "POST",
      url,
      data: { postId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("Post unsaved:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error unsaving post:", error.message);
    return { error: error.message, status: 500 };
  }
};

// const uploadPost = async (formData) => {
//   try {
//     const url = `${baseURL}/posts/create`;
//     const response = await axios({
//       method: "POST",
//       url,
//       data: formData,
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log("Post uploaded:", response.data);
//     return response.data;
//   } catch (error) {
//     console.log("Error uploading post:", error.message);
//     return { error: error.message, status: 500 };
//   }
// };

const uploadPost = async (formData) => {
  try {
    const url = `${baseURL}/posts/upload`;
    const response = await axios({
      method: "POST",
      url,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Post uploaded:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error uploading post:", error.message);
    return { error: error.message, status: 500 };
  }
};

  const clearAllData = () => {
    // setUserName("");
    setToken("");
    setUser("");
  };
  return (
    <GlobalMethodsContext.Provider
      value={{
        clearAllData,
        SignIn,
        SignUp,
        AllPosts,
        addComment,
        likePost,
        unlikePost,
        savePost,
        unsavePost,
        uploadPost
      }}
    >
      {children}
    </GlobalMethodsContext.Provider>
  );
};
export { GlobalMethodsContext, GlobalMethodsProvider };