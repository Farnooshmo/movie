// @ts-check
/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const serverPort = 4000;

const pool = new Pool({
  user: process.env.USERNAME, 
  host: process.env.HOSTNAME,
  database: process.env.DATABASE, 
  password: process.env.DB_PASSWORD,
  port: 5432, 
});
// const allowedOrigins = ['https://movie-farnoosh.netlify.app', 'http://localhost:5173'];
// app.use(cors({
//   origin: allowedOrigins
// }));
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
