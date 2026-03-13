import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/CommentSection.css'

const Avatar = ({ user }) => (
  <div className="cs-avatar">{user.slice(0, 1).toUpperCase()}</div>
)

export default function CommentSection({ onClose, setCommentsCount, video }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {

    const fetchComments = async () => {

      try {

        const res = await axios.get(
          `https://food-reels-app.onrender.com/api/food/Comments/${video._id}`);

        setComments(res.data.comments);

      } catch (err) {
        console.log(err);
      }

    };

    fetchComments();

  }, [video._id]);

  const add = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://food-reels-app.onrender.com/api/food/CommentFood', { foodId: video._id, text }, { withCredentials: true })
      setComments(prev => [res.data.comment, ...prev]);
      setCommentsCount(prev => prev + 1);
      setText('');
    } catch (err) {
      console.error('Comment post failed', err)
    }
  }

 const toggleLike = async (id) => {
  try {

    const res = await axios.post(
      "https://food-reels-app.onrender.com/api/food/commentLike",
      { commentId: id },
      { withCredentials: true }
    );

    setComments(cs =>
      cs.map(c => {
        if (c._id !== id) return c;

        if (res.data.message === "Comment Liked") {
          return {
            ...c,
            likeCount: (c.likeCount || 0) + 1,
            _liked: true
          };
        }

        if (res.data.message === "Comment Unliked") {
          return {
            ...c,
            likeCount: Math.max((c.likeCount || 1) - 1, 0),
            _liked: false
          };
        }

        return c;
      })
    );

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="cs-overlay" role="dialog" aria-modal="true">
      <div className="cs-panel">
        <header className="cs-header">
          <button className="cs-close" onClick={onClose} aria-label="close">✕</button>
          <div className="cs-title">Comments</div>
          <div className="cs-count">{comments.length}</div>
        </header>

        <div className="cs-list">
          {comments.map(c => (
            <div className="cs-item" key={c._id}>
              <Avatar user={c.userId.name} />
              <div className="cs-body">
                <div className="cs-row"><strong className="cs-user">{c.userId.name}</strong> <span className="cs-text">{c.text}</span> <button className={`cs-like ${c._liked ? 'liked' : ''}`} onClick={() => toggleLike(c._id)} aria-label="like comment">❤ {c.likeCount || 0 }</button></div>
                
              </div>
            </div>
          ))}
        </div>

        <form className="cs-input" onSubmit={add}>
          <input placeholder="Add a comment..." value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" className={`cs-post ${text.trim() ? 'active' : ''}`}>Post</button>
        </form>
      </div>
    </div>
  )
}
