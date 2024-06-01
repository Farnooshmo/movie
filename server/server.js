/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const serverPort = 4000;

console.log("Database url:", process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Only if SSL validation is required
  }
});

app.use(cors());
app.use(express.json());

app.get("/videos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM videos");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve videos." });
  }
});

app.post("/videos", async (req, res) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }
    const { rows } = await pool.query(
      "INSERT INTO videos (title, url, rating) VALUES ($1, $2, $3) RETURNING *",
      [title, url, 0]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

app.get("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    if (rows.length === 0) {
      res.status(404).json({ result: "failure", message: "Video not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "failure", message: "Error retrieving video" });
  }
});

app.delete("/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM videos WHERE id = $1", [id]);
    res.json({ result: "success", message: "Video deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "failure", message: "Video could not be deleted" });
  }
});

app.put("/videos/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "UPDATE videos SET rating = rating + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "failure", message: "Video could not be upvoted" });
  }
});

app.put("/videos/:id/downvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "UPDATE videos SET rating = rating - 1 WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "failure", message: "Video could not be downvoted" });
  }
});

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
