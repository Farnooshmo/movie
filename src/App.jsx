import React, { useState, useEffect } from "react";
import "./App.css";
import AddVideoForm from "./components/AddVideoForm";
import Video from "./components/Video";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // console.log("API Endpoint:", import.meta.env.VITE_API_ENDPOINT); // Debug log
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_ENDPOINT);

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
      const res = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVideo),
      });
      const data = await res.json();
      setVideos((prevVideos) => [...prevVideos, data]);
    } catch (err) {
      console.log("Error adding video:", err);
    }
  };

  const handleUpVote = async (videoId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/${videoId}/upvote`,
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
        `${import.meta.env.VITE_API_ENDPOINT}/${videoId}/downvote`,
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
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/${videoId}`, {
        method: "DELETE",
      });
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
      <div className="video-grid">
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
      </div>
      <Footer />
    </div>
  );
};

export default App;
