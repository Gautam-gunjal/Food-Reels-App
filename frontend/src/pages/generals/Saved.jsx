import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import axios from "axios";
import ReelActions from "../../components/Reel_actions";
import BottomNav from "../../components/Bottom_nav";

const VideoCard = ({ video }) => {
  return (
    <div className="reels-video-container">
      <video
        className="reels-video"
        src={video.video}
        muted
        playsInline
        loop
        preload="metadata"
        onClick={(e) => {
          const v = e.currentTarget;
          if (v.paused) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }}
      />

      <div className="reels-overlay">
        <div className="reels-info">
          <div className="reels-description">{video.description}</div>
          <Link to={"/food-partner/" + video.foodPartner} className="reels-visit-btn">
            Visit Store
          </Link>
        </div>

        <ReelActions video={video} />
      </div>
    </div>
  );
};

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const feedRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    async function fetchSaved() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/food/SavedFoods", { withCredentials: true });
        const saved = (res.data.savedfoods || []).map((f) => ({
          _id: f.foodId._id,
          video: f.foodId.video,
          description: f.foodId.description,
          likeCount: f.foodId.likeCount,
          saveCount: f.foodId.saveCount,
          foodPartner: f.foodId.foodPartner,
          name: f.foodId.name,
        }));
        setVideos(saved);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved items");
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  useEffect(() => {
    if (!feedRef.current) return;
    const videoEls = Array.from(feedRef.current.querySelectorAll("video"));
    if (videoEls.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const callback = (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) {
        videoEls.forEach((v) => {
          try { v.pause(); } catch (e) {}
        });
        return;
      }

      let top = visible[0];
      for (let i = 1; i < visible.length; i++) {
        if (visible[i].intersectionRatio > top.intersectionRatio) top = visible[i];
      }

      videoEls.forEach((v) => {
        try {
          if (v === top.target) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          } else {
            v.pause();
          }
        } catch (e) {}
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: buildThresholdList(),
    });

    videoEls.forEach((v) => observer.observe(v));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [videos]);

  function buildThresholdList() {
    const thresholds = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) thresholds.push(i / steps);
    return thresholds;
  }

  return (
    <>
      <div className="reels-feed" ref={feedRef}>
        {loading && (
          <div className="reels-status">
            <div>Loading saved videos…</div>
          </div>
        )}

        {error && (
          <div className="reels-status error">
            <div>{error}</div>
          </div>
        )}

        {!loading && videos.length === 0 && !error && (
          <div className="reels-status saved-empty" role="status" aria-live="polite">
            <div className="empty-card">
              <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-illustration" aria-hidden>
                <path d="M6 2h8a2 2 0 0 1 2 2v16l-6-3-6 3V4a2 2 0 0 1 2-2z" fill="currentColor" opacity="0.95" />
              </svg>
              <div className="empty-title">No saved videos yet</div>
              <div className="empty-desc">Save videos you love to view them later. Start exploring fresh content now.</div>
              <Link to="/" className="empty-cta">Browse Reels</Link>
            </div>
          </div>
        )}

        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>

      <BottomNav />
    </>
  );
};

export default Saved;
