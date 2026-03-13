import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Home.css";
import '../../components/HamburgerMenu'
import ReelActions from "../../components/Reel_actions";
import BottomNav from "../../components/Bottom_nav";
import HamburgerMenu from "../../components/HamburgerMenu";

/**
 * Home.jsx - Reels style UI
 *
 * Backend expected response:
 * {
 *   message: "...",
 *   fooditems: [{ _id, name, video, description, storeUrl? }, ...]
 * }
 *
 * Notes:
 * - Place this component where you want the feed rendered (e.g. route "/")
 * - Ensure video.video is a direct, publicly accessible video URL
 */

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

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const feedRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    async function fetchVideos() {
      try { 
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/food/",{ withCredentials: true });
        // backend returns { message: "...", fooditems: [...] }
        setVideos(res.data?.fooditems || []);
      } catch (err) {
        console.error("Failed to fetch videos", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    // Setup IntersectionObserver once we have video elements
    if (!feedRef.current) return;
    const videoEls = Array.from(feedRef.current.querySelectorAll("video"));

    // If no video elements, nothing to observe
    if (videoEls.length === 0) return;

    // Clean up previous observer if present
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Callback chooses the most visible video (highest intersectionRatio)
    const callback = (entries) => {
      // Filter entries that are intersecting
      const visible = entries.filter((e) => e.isIntersecting);

      if (visible.length === 0) {
        // pause all if none visible
        videoEls.forEach((v) => {
          try { v.pause(); } catch (e) {}
        });
        return;
      }

      // Pick the one with the highest intersectionRatio`
      let top = visible[0];
      for (let i = 1; i < visible.length; i++) {
        if (visible[i].intersectionRatio > top.intersectionRatio) {
          top = visible[i];
        }
      }

      // Play the top video, pause others
      videoEls.forEach((v) => {
        try {
          if (v === top.target) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {}); // ignore play promise rejection
          } else {
            v.pause();
          }
        } catch (e) {
          // ignore
        }
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
    <HamburgerMenu />
    <div className="reels-feed" ref={feedRef}>

      {loading && (
        <div className="reels-status">
          <div>Loading videos…</div>
        </div>
      )}

      {error && (
        <div className="reels-status error">
          <div className="auth-card" role="alert" aria-live="polite">
            <div className="auth-illustration" aria-hidden>
              {/* simple lock/exclamation SVG */}
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2a4 4 0 00-4 4v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a4 4 0 00-4-4z" stroke="#ffd166" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11v3" stroke="#ffd166" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="17.2" r="0.5" fill="#ffd166"/>
              </svg>
            </div>

            <h2 className="auth-title">Failed to load videos</h2>
            <p className="auth-desc">
              It looks like you’re not signed in — sign in to see the feed.
              If you already have an account, try logging in.
            </p>

            <div className="auth-actions">
              <Link to="/user/login" className="btn btn-primary" onClick={() => window.scrollTo(0,0)}>
                Login
              </Link>

              <Link to="/user/register" className="btn btn-ghost" onClick={() => window.scrollTo(0,0)}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="reels-status">
          <div>No videos yet.</div>
        </div>
      )}

      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>

    <BottomNav />
  </>
);
};

export default Home;