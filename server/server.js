const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  
});

app.use(cors({
    origin: 'https://movie-farnoosh.netlify.app/',
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
  }));
app.use(express.json());

async function connectToDatabase() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

//  Get all of the videos
app.get("/videos", async (req, res) => {
  try {
    const query = "SELECT * FROM videos";
    const result = await client.query(query);
    const videos = result.rows;
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve videos." });
  }
});

//  Add a video to the API.
app.post("/videos", async (req, res) => {
  try {
    const { title, url } = req.body;
    const rating = 0;
    const query =
      "INSERT INTO videos (title, url, rating) VALUES ($1, $2, $3) RETURNING *";
    const values = [title, url, rating];
    const result = await client.query(query, values);
    const newVideo = result.rows[0];
    res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

// Get the video with the ID

app.get("/videos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const query = "SELECT * FROM videos WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    const video = result.rows[0];

    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ result: "failure", message: "Video not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "failure", message: "Error retrieving video" });
  }
});
// Deletes the video with the ID
app.delete("/videos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const query = "DELETE FROM videos WHERE id = $1";
    const values = [id];
    await client.query(query, values);
    res.json({ result: "success", message: "Video deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ result: "failure", message: "Video could not be deleted" });
  }
});

// Upvote a video by ID
app.put("/videos/:id/upvote", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const query =
      "UPDATE videos SET rating = rating + 1 WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await client.query(query, values);
    const updatedVideo = result.rows[0];
    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ result: "failure", message: "Video could not be upvoted" });
  }
});

// Downvote a video by ID
app.put("/videos/:id/downvote", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const query =
      "UPDATE videos SET rating = rating - 1 WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await client.query(query, values);
    const updatedVideo = result.rows[0];
    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ result: "failure", message: "Video could not be downvoted" });
  }
});

app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));
connectToDatabase();