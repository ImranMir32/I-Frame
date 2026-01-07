import React, { useRef, useState } from "react";
import "../styles/Upload.css";

const Upload = () => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = () => {
    setPreview(null);
    setCaption("");
  };

  return (
    <div className="create-post-wrapper">
      <div className="create-post-card">

        <div className="create-post-header">
          <h3>Create new post</h3>
          {preview && <button className="share-btn">Upload</button>}
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
              <button className="remove-btn" onClick={removeImage}>
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