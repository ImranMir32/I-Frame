import React, { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GlobalStateContext } from "../Context/Global_Context"; // Import GlobalStateContext

const Feed = () => {
  const { AllPosts } = useContext(GlobalMethodsContext);
  const { user } = useContext(GlobalStateContext); // Get user from context
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await AllPosts();
        
        if (data === 500) {
          setError("Failed to fetch posts. Please try again later.");
          setPosts([]);
        } else {
          // Add isLiked field to each post based on current user
          const processedPosts = data.map(post => ({
            ...post,
            isLiked: user && post.likes ? post.likes.includes(user.id) : false,
            isSaved: user && user.savedPhotos ? user.savedPhotos.includes(post.id) : false
          }));
          
          setPosts(processedPosts);
          setError(null);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        setPosts([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [AllPosts, user]); // Add user to dependency array

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available.</div>;
  }

  console.log("posts in feed: ", posts);
  console.log("user in feed: ", user);
  return (
    <>
      {posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </>
  );
};

export default Feed;