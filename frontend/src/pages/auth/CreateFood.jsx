import React, { useState, useRef } from 'react'
import '../../styles/auth-page.css'
import '../../styles/CreateFood.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import HamburgerMenu from '../../components/HamburgerMenu';

const CreateFood = () => {
  const navigate = useNavigate()
  const [videoPreview, setVideoPreview] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const videoInputRef = useRef(null)

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    } else {
      setVideoFile(null)
      setVideoPreview(null)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    if (videoInputRef.current) videoInputRef.current.value = null
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('video', videoFile)

    try {
      await axios.post("https://food-reels-app.onrender.com/api/food", formData, {
        withCredentials: true,
      })
      navigate('/')  
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth-page">
      <HamburgerMenu></HamburgerMenu>
      <div className="auth-card create-food-card">
        <h2>Create food item</h2>
        <p>Upload a short video and provide details for the food.</p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Video</label>
            <div className="food-video-field">
              <input ref={videoInputRef} id="video-input" type="file" accept="video/*" name="video" onChange={handleVideoChange} hidden />

              <label htmlFor="video-input" className="video-uploader" tabIndex={0}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="video-uploader-text">
                  <div className="title">Upload video</div>
                  <div className="muted">MP4, MOV — up to 50MB</div>
                </div>

                {videoFile && <div className="video-file-name">{videoFile.name}</div>}
              </label>

              {videoPreview && (
                <div className="video-preview-wrap">
                  <video className="food-video-preview" controls src={videoPreview} />
                  <button type="button" className="video-remove-btn" onClick={removeVideo} aria-label="Remove video">Remove</button>
                </div>
              )}
            </div>
          </div>

          <div className="field">
            <label>Name</label>
            <input type="text" name="name" value={name} placeholder="Food name" onChange={(e)=>setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea name="description" value={description} placeholder="Short description" rows="4" onChange={(e)=>setDescription(e.target.value)} />
          </div>

          <div className="actions">
            <button type="submit" className="btn">Create food</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood