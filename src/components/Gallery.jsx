import React, { useState } from "react";
import "../styles/Gallery.css";
import zoro from "../assets/zoro.jpg"

const sampleImages = [
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  {
    id: 1,
    url: {zoro},
    caption: "Beautiful scenery",
    comments: ["Amazing!", "Wow!"],
  },
  {
    id: 2,
    url: {zoro},
    caption: "City life",
    comments: ["Love this!", "Great shot!"],
  },
  {
    id: 3,
    url: {zoro},
    caption: "Sunset vibes",
    comments: ["So peaceful", "Lovely colors!"],
  },
  
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [newComment, setNewComment] = useState("");

  const openPopup = (image) => {
    setSelectedImage(image);
    setNewComment("");
  };

  const closePopup = () => setSelectedImage(null);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      selectedImage.comments.push(newComment.trim());
      setSelectedImage({ ...selectedImage }); // trigger re-render
      setNewComment("");
    }
  };

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {sampleImages.map((img) => (
          <div key={img.id} className="gallery-card" onClick={() => openPopup(img)}>
            <img src={img.url} alt={img.caption} />
            <p className="caption">{img.caption}</p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.caption} />
            <div className="popup-info">
              <h3>{selectedImage.caption}</h3>
              <div className="reactions">
                <button>👍 Like</button>
                <button>❤️ Love</button>
                <button>😂 Haha</button>
              </div>
              <div className="comments-section">
                <h4>Comments</h4>
                <ul>
                  {selectedImage.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
                <form onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">Post</button>
                </form>
              </div>
            </div>
            <button className="close-btn" onClick={closePopup}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
