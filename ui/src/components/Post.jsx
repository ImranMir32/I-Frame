import React, { useState, useContext } from "react";
import "../styles/Post.css";
import admin from "../assets/admin.png";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GlobalStateContext } from "../Context/Global_Context";
import { FaHeart, FaComment, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

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
console.log("Rendering Post component with post:", post.createdAt);

const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    // Returns: "about 2 hours ago", "3 days ago", "1 month ago", etc.
  };

  return (
    <div className="magazine-post">
      {/* Left Column - Content */}
      <div className="post-content">


        <div className="post-header">
          <img src={admin} alt="admin" className="author-avatar" />
          <div className="author-info">
            <h3 className="author-name">Admin</h3>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
          <button className="more-options">
            <FaEllipsisH />
          </button>
        </div>

        <h2 className="post-title">{post.title}</h2>

        <div className="post-image-container">
          <img src={post.imgUrl} alt="post" className="featured-image" />
          <div className="image-overlay">
            <span className="image-caption"></span>
          </div>
        </div>



        <div className="action-stats">
          <div className="stat-item">
            <FaHeart className={liked ? "stat-icon liked" : "stat-icon"} />
            <span>{likes} Likes</span>
          </div>
          <div className="stat-item">
            <FaComment className="stat-icon" />
            <span>{comments.length} Comments</span>
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="post-sidebar">
        <div className="sidebar-section">
          <h4>Recent Comments</h4>
          <div className="comments-list">
            {comments.slice(0, 3).map((c, i) => (
              <div key={i} className="sidebar-comment">
                <strong>{c.userName}:</strong>
                <p>{c.text.length > 40 ? c.text.substring(0, 40) + '...' : c.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="no-comments">No comments yet. Be the first!</p>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <h4>Interact</h4>
          <div className="interaction-buttons">
            <button
              onClick={toggleLike}
              className={`action-btn ${liked ? 'liked-btn' : ''}`}
              disabled={!user}
            >
              <FaHeart /> {liked ? 'Liked' : 'Like'}
            </button>
            <button
              className="action-btn"
              onClick={() => document.querySelector('.comment-input').focus()}
              disabled={!user}
            >
              <FaComment /> Comment
            </button>
            <button
              onClick={toggleSave}
              className="action-btn"
            >
              <FaBookmark className={saved ? 'saved' : ''} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="sidebar-section">
          <h4>Add Comment</h4>
          <form className="sidebar-comment-form" onSubmit={handleAddComment}>
            <textarea
              className="comment-input"
              placeholder={user ? "Share your thoughts..." : "Login to comment"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
            />
            <button
              type="submit"
              className="submit-comment"
              disabled={!comment.trim() || isSubmitting || !user}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;