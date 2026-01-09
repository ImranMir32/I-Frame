import React, { useState, useContext } from "react";
import "../styles/Post.css";
import admin from "../assets/admin.png";
import unsave from "../assets/unsave.png";
import save from "../assets/save..png";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GlobalStateContext } from "../Context/Global_Context";

const Post = ({ post }) => {
  const { addComment, likePost, unlikePost, savePost, unsavePost } = useContext(GlobalMethodsContext);
  const { user } = useContext(GlobalStateContext);
  console.log("post in Post component: ", post);
  // Use isLiked from the post prop
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [likes, setLikes] = useState(post.likes.length);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    try {
      if (liked) {
        // Unlike the post
        const result = await unlikePost(post.id);
        if (result && !result.error) {
          setLiked(false);
          setLikes(prev => prev - 1);
        }
      } else {
        // Like the post
        const result = await likePost(post.id);
        if (result && !result.error) {
          setLiked(true);
          setLikes(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      alert("Please login to save posts");
      return;
    }

    if (isSaving) return;
    
    setIsSaving(true);
    try {
      if (saved) {
        // Unsave the post
        const result = await unsavePost(post.id);
        if (result && !result.error) {
          setSaved(false);
          // Optional: Update user context if needed
        }
      } else {
        // Save the post
        const result = await savePost(post.id);
        if (result && !result.error) {
          setSaved(true);
          // Optional: Update user context if needed
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting || !user) {
      if (!user) alert("Please login to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        text: comment.trim(),
        userId: user.id,
        userName: user.name || "User",
      };

      const result = await addComment(post.id, commentData);
      
      if (result && !result.error) {
        const newComment = {
          userName: commentData.userName,
          userId: commentData.userId,
          text: commentData.text,
          createdAt: new Date().toISOString(),
        };
        
        setComments(prev => [...prev, newComment]);
        setComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={admin} alt="admin" className="avatar" />
        <span className="username">Admin</span>
      </div>

      <div className="post-caption">{post.title}</div>

      <div className="post-image">
        <img src={post.imgUrl} alt="post" />
      </div>

      <div className="post-actions">
        <button 
          onClick={toggleLike} 
          className={liked ? "liked" : ""}
          disabled={!user}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <span className="likes">{likes} likes</span>

         <button 
          onClick={toggleSave}
          className={`save-btn ${saved ? "saved" : ""}`}
          disabled={!user || isSaving}
          style={{ marginLeft: 'auto' }}
        >
          <img src={saved ? save : unsave} alt="img" className="save-icon" />
        </button>
      </div>

      <div className="post-comments">
        {comments.map((c, i) => (
          <p key={i}>
            <strong>{c.userName}: </strong> {c.text}
          </p>
        ))}
      </div>

      <form className="comment-box" onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder={user ? "Add a comment..." : "Login to comment"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user || isSubmitting}
        />
        <button 
          type="submit" 
          disabled={!user || !comment.trim() || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default Post;