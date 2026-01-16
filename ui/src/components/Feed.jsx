import React, { useContext, useEffect, useState, useMemo } from "react";
import Post from "./Post";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GlobalStateContext } from "../Context/Global_Context";

const Feed = ({ searchQuery = "" }) => {
  const { AllPosts } = useContext(GlobalMethodsContext);
  const { user } = useContext(GlobalStateContext);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter posts based on search query
  const filterPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPosts;
    }
    
    const query = searchQuery.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(query)
    );
  }, [allPosts, searchQuery]);

  useEffect(() => {
    setFilteredPosts(filterPosts);
  }, [filterPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await AllPosts();
        
        if (data === 500) {
          setError("Failed to fetch posts. Please try again later.");
          setAllPosts([]);
        } else {
          // Add isLiked field to each post based on current user
          const processedPosts = data.map(post => ({
            ...post,
            isLiked: user && post.likes ? post.likes.includes(user.id) : false,
            isSaved: user && user.savedPhotos ? user.savedPhotos.includes(post.id) : false
          }));
          
          setAllPosts(processedPosts);
          setError(null);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        setAllPosts([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [AllPosts, user]);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      {/* Search Results Info */}
      {searchQuery.trim() && (
        <div className="search-results-info">
          <p>
            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} 
            {allPosts.length > 0 && ` (filtered from ${allPosts.length} total)`}
          </p>
          {filteredPosts.length === 0 && allPosts.length > 0 && (
            <p className="no-results">No posts found with title containing "{searchQuery}"</p>
          )}
        </div>
      )}
      
      {/* Posts */}
      {filteredPosts.length === 0 && !searchQuery.trim() ? (
        <div className="no-posts">No posts available.</div>
      ) : (
        filteredPosts.map((p) => (
          <Post key={p.id} post={p} />
        ))
      )}
    </>
  );
};

export default Feed;