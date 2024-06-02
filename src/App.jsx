import  { useState, useEffect } from "react";
import './App.css';

import AddVideoForm from "./components/AddVideoForm";
import Video from "./components/Video";
import Header from "./components/Header";
import './App.css';
import Footer from "./components/Footer";

const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("https://movie-7cn3.onrender.com/videos");
      
      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }
      
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const handleAddVideo = async (newVideo) => {
    try {
      const res = await fetch(
        "https://movie-7cn3.onrender.com/videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVideo),
        }
      );
      const data = await res.json();
      setVideos((prevVideos) => [...prevVideos, data]);
    } catch (err) {
      console.log("Error adding video:", err);
    }
  };

  const handleUpVote = async (videoId) => {
    try {
      await fetch(
        `https://movie-7cn3.onrender.com/videos/${videoId}/upvote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, rating: video.rating + 1 } : video
        )
      );
    } catch (err) {
      console.log("Error upvoting video:", err);
    }
  };

  const handleDownVote = async (videoId) => {
    try {
      await fetch(
        `https://movie-7cn3.onrender.com/videos/${videoId}/downvote`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, rating: video.rating - 1 } : video
        )
      );
    } catch (err) {
      console.log("Error downvoting video:", err);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await fetch(
        `https://movie-7cn3.onrender.com/videos/${videoId}`,
        {
          method: "DELETE",
        }
      );
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId)
      );
    } catch (err) {
      console.log("Error removing video:", err);
    }
  };

  return (
    <div className="app">
      <Header />
      <AddVideoForm onAddVideo={handleAddVideo} />
    
       {videos.map((video) => (
          <Video
            key={video.id}
            title={video.title}
            url={video.url}
            rating={video.rating}
            onUpVote={() => handleUpVote(video.id)}
            onDownVote={() => handleDownVote(video.id)}
            onRemove={() => handleRemoveVideo(video.id)}
          />
        ))}
      
      <Footer />
    </div>
  );
};

export default App;
