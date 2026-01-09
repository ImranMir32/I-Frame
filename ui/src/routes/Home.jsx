import React, { useState } from "react";
import logo from "../assets/IFrame.png"
import upload_img from "../assets/home.png"
import search_img from "../assets/search.png"
import save_img from "../assets/save.png"
import user_img from "../assets/notifications.png"
import request_img from "../assets/profile.gif"
import logout_img from "../assets/logout.png"
import "../styles/Admin.css";
import SaveItems from "../components/SaveItems.jsx";
// import Post from "../components/Post.jsx";
import Feed from "../components/Feed.jsx";


const Home = () => {
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
                                Home
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
                            <img src={save_img} alt="" />
                            <p
                                onClick={() => {
                                    handleButtonClick("Save Items");
                                }}
                                className={Page === "Save Items" ? "active" : "non-active"}
                            >
                                Save Items
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
                                Notifications
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
                                Profile
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
                            {Page === "Upload Photo" && <Feed />}
                             {Page === "Save Items" && <SaveItems />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;