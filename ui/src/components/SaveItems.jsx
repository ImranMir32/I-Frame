import React, { useState, useContext, useEffect } from "react";
import "../styles/Gallery.css";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GlobalStateContext } from "../Context/Global_Context"; // Import GlobalStateContext

const SaveItems = () => {
  const { AllPosts } = useContext(GlobalMethodsContext);
  const { user } = useContext(GlobalStateContext); // Get user data
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("user in SaveItems: ", user);
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await AllPosts();
        
        if (data === 500) {
          console.error("Failed to fetch images");
          setImages([]);
        } else {
          // Filter images to show only saved ones
          if (user && user.savedPhotos && user.savedPhotos.length > 0) {
            const savedImages = data.filter(post => 
              user.savedPhotos.includes(post.id)
            );
            setImages(savedImages);
          } else {
            setImages([]); // No saved photos
          }
        }
      } catch (err) {
        console.error(err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [AllPosts, user]); // Add user to dependency array

  const openPopup = (image) => {
    setSelectedImage(image);
  };

  const closePopup = () => setSelectedImage(null);

  if (loading) {
    return <div className="loading">Loading saved items...</div>;
  }

  // Check if user is logged in
  if (!user) {
    return <div className="no-images">Please login to view saved items.</div>;
  }

  // Check if user has saved photos
  if (!user.savedPhotos || user.savedPhotos.length === 0) {
    return <div className="no-images">You haven't saved any items yet.</div>;
  }

  // Check if filtered images array is empty
  if (images.length === 0) {
    return <div className="no-images">No saved items found.</div>;
  }

  return (
    <div className="gallery-container">
      <h2>Saved Items ({images.length})</h2>
      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img.id} className="gallery-card" onClick={() => openPopup(img)}>
            <img src={img.imgUrl} alt={img.title || "Image"} />
            {img.title && <p className="caption">{img.title}</p>}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.imgUrl} alt={selectedImage.title} />
            <div className="popup-info">
              <h3>{selectedImage.title || "Untitled"}</h3>
              {selectedImage.metadata && (
                <div className="image-details">
                  <p><strong>Original Name:</strong> {selectedImage.metadata.originalName}</p>
                  <p><strong>Size:</strong> {Math.round(selectedImage.metadata.size / 1024)} KB</p>
                  <p><strong>Uploaded:</strong> {new Date(selectedImage.createdAt).toLocaleDateString()}</p>
                  <p><strong>Saved:</strong> {user.savedPhotos.includes(selectedImage.id) ? "✓" : "Not saved"}</p>
                </div>
              )}
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

export default SaveItems;