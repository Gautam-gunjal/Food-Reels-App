import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setprofile] = useState(null);
    const [videos, setVideos] = useState([]);

    const totalComments = videos.reduce((sum, v) => {
        return sum + (v.commentCount || 0);
    }, 0);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
            .then((res) => {
                setprofile(res.data.foodpartner);
                setVideos(res.data.foodpartner.fooditems || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    return (
        <div className="profile-mobile">
            <div className="pm-card">

                {/* Back arrow button */}
                <button
                    className="pm-back-btn"
                    aria-label="Go back to home"
                    onClick={() => navigate(-1)}
                >
                    {/* simple left arrow SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z" /></svg>
                </button>
                {/* HEADER SECTION */}
                <div className="pm-header">

                    <div className="pm-header-top">

                        <img
                            className="pm-avatar"
                            src="https://images.unsplash.com/photo-1769784497064-d791c39fef39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D"
                            alt={`${profile?.Businessname || "Store"} avatar`}
                        />

                        <div className="pm-info">
                            <div className="pm-pill">{profile?.Businessname}</div>
                            <div className="pm-pill pm-pill-secondary">{profile?.Address}</div>
                        </div>
                    </div>

                    <div className="pm-stats">
                        <div className="pm-stat">
                            <span className="pm-label">Total Reels</span>
                            <span className="pm-value">{videos.length}</span>
                        </div>

                        <div className="pm-stat">
                            <span className="pm-label">Total Comments</span>
                            <span className="pm-value">{totalComments}</span>
                        </div>
                    </div>
                </div>

                <hr className="pm-divider" />

                {/* VIDEO GRID */}
                <div className="pm-grid">
                    {videos.map((v) => (
                        <div key={v._id} className="pm-items">
                            <video className="video" src={v.video} muted />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}