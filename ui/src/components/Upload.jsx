import React, { useRef, useState, useContext } from "react";
import "../styles/Upload.css";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const { uploadPost } = useContext(GlobalMethodsContext);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreview(null);
    setCaption("");
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    if (isUploading) return;

    setIsUploading(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', caption || "");

      // Add metadata if needed by backend
      formData.append('metadata', JSON.stringify({
        originalName: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      }));

      const result = await uploadPost(formData);

      if (result && !result.error) {
        // Upload successful
        toast.success("Post uploaded successfully!");
        // Reset form
        removeImage();
        navigate("/admin-panel");
      } else {
        toast.error(result?.error || "Failed to upload post");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="create-post-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="create-post-card">
        <div className="create-post-header">
          <h3>Create new post</h3>
          {preview && (
            <button
              className="share-btn"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>

        {!preview && (
          <div className="create-post-body">
            <div className="upload-icon">📷</div>
            <button
              className="select-btn"
              onClick={() => inputRef.current.click()}
            >
              Select from computer
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>
        )}

        {preview && (
          <div className="post-editor-vertical">

            <div className="caption-top">
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="image-bottom">
              <button
                className="remove-btn"
                onClick={removeImage}
                disabled={isUploading}
              >
                ✕
              </button>
              <img src={preview} alt="preview" />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Upload;