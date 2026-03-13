import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from './CommentSection'

const ReelActions = ({ video }) => {

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likeCount);
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(video.saveCount);
  const [commentsCount, setCommentsCount] = useState(video.commentCount || 0);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = async () => {
    try {

      const res = await axios.post(
        "https://food-reels-app.onrender.com/api/food/like",
        { foodId: video._id },
        { withCredentials: true }
      );

      if (res.data.message === "Food Unliked Successfully") {
        setLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
      } else {
        setLiked(true);
        setLikesCount((c) => c + 1);
      }

    } catch (err) {
      console.error("Like failed", err);
    }

  };

  const toggleSave = async () => {
    try{
      const res = await axios.post('https://food-reels-app.onrender.com/api/food/save',{foodId:video._id},{withCredentials:true})

      if(res.data.message === 'Food Unsaved successfully'){
        setSaved(false)
        setSavedCount((s)=> Math.max(0,s-1))
      }
      else if(res.data.message === 'Food saved successfully')
      {
        setSaved(true)
        setSavedCount((s)=> s+1)
      }
    }catch(err)
    {
      console.log(err)
    }
  };

  const addComment = () => {
    setShowComments(true)
  };


  return (
    <div className="reels-actions">
      <button className={`action-btn ${liked ? 'active' : ''}`} onClick={toggleLike} aria-label="like" aria-pressed={liked}>
        {/*  Like  */}
        <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          {liked ? (
            <path fill="#ff6b6b" d="M12.1 21.35l-1.1-.99C5.14 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.14 6.86-8.9 11.86l-1.0.99z" />
          ) : (
            <path fill="#ffffff" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.14 6.86 8.9 11.86l1.1.99 1.1-.99C18.86 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z" />
          )}
        </svg>
        <div className="action-label">{likesCount}</div>
      </button>

      <button className={`action-btn ${saved ? 'active' : ''}`} onClick={toggleSave} aria-label="save" aria-pressed={saved}>
        {/* bookmark */}
        <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6 2a2 2 0 0 0-2 2v16l8-4 8 4V4a2 2 0 0 0-2-2H6z" fill={saved ? '#ffd166' : 'none'} stroke={saved ? '#ffd166' : '#ffffff'} strokeWidth="1.2" />
        </svg>
        <div className="action-label">{savedCount}</div>
      </button>

      <button className="action-btn" onClick={addComment} aria-label="comment">
        {/* comment */}
        <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="#ffffff" strokeWidth="1.2" />
        </svg>
        <div className="action-label">{commentsCount}</div>
      </button>
      {showComments && (
        <CommentSection onClose={()=>setShowComments(false)} setCommentsCount={setCommentsCount} video={video}/>
      )}
    </div>
  );
};

export default ReelActions;
