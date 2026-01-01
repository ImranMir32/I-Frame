import React, { useState } from "react";
import "../styles/Post.css";

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.userAvatar} alt="user" className="avatar" />
        <span className="username">{post.username}</span>
      </div>

      <div className="post-image">
        <img src={post.image} alt="post" />
      </div>

      <div className="post-actions">
        <button onClick={toggleLike} className={liked ? "liked" : ""}>
          {liked ? "❤️" : "🤍"}
        </button>
        <span className="likes">{likes} likes</span>
      </div>

      <div className="post-caption">
        <strong>{post.username}</strong> {post.caption}
      </div>

      <div className="post-comments">
        {comments.map((c, i) => (
          <p key={i}>
            <strong>user</strong> {c}
          </p>
        ))}
      </div>

      <form className="comment-box" onSubmit={addComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Post;
