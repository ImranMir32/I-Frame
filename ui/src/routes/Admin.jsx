import React, { useState } from "react";
import Upload from "../components/Upload.jsx"
import logo from "../assets/IFrame.png"
import upload_img from "../assets/upload.png"
import search_img from "../assets/search.png"
import gallery_img from "../assets/gallery.png"
import user_img from "../assets/user.png"
import request_img from "../assets/request.png"
import draft_img from "../assets/draft.png"
import logout_img from "../assets/logout.png"
import "../styles/Admin.css";
import Gallery from "../components/Gallery.jsx";


const Admin = () => {
    const [Page, setPage] = useState("Upload Photo");

    const handleButtonClick = (param) => {
        setPage(param);
    };

    return (
        <div>
            <div className="admin-container">
                <div className="admin-topic-name">
                    <img className="logo" src={logo} alt="" />
                    <div className="admin-content">
                        <div className="content-div">
                            <img src={upload_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("Upload Photo");
                                }}
                                className={Page === "Upload Photo" ? "active" : "non-active"}
                            >
                                Upload Photo
                            </p>
                        </div>

                        <div className="content-div">
                            <img src={gallery_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("Gallery");
                                }}
                                className={Page === "Gallery" ? "active" : "non-active"}
                            >
                                Gallery
                            </p>
                        </div>

                        <div className="content-div">
                            <img src={search_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("Search");
                                }}
                                className={Page === "Search" ? "active" : "non-active"}
                            >
                                Search
                            </p>
                        </div>

                        <div className="content-div">
                            <img src={user_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("User List");
                                }}
                                className={Page === "User List" ? "active" : "non-active"}
                            >
                                User List
                            </p>
                        </div>
                        <div className="content-div">
                            <img src={request_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("User Request");
                                }}
                                className={Page === "User Request" ? "active" : "non-active"}
                            >
                                User Request
                            </p>
                        </div>
                        <div className="content-div">
                            <img src={draft_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("Draft");
                                }}
                                className={Page === "Draft" ? "active" : "non-active"}
                            >
                                Draft
                            </p>
                        </div>

                        <div className="content-div">
                            <img src={logout_img} alt="" />
                            <p
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                                className={Page === "Draft" ? "active" : "non-active"}
                            >
                                Log Out
                            </p>
                        </div>
                    </div>
                </div>
                <div className="vertical-line"></div>
                <div className="admin-topic-details-scrollview">
                    {/* <h1>{Page}</h1> */}
                    <div className="scrollable-section">
                        <div className="admin-topic-details">
                            {Page === "Upload Photo" && <Upload />}
                            {Page === "Gallery" && <Gallery />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;