import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 5000;
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());




//  Get all of the videos
app.get("/videos", async (req, res) => {
    try {
      const { data, error } = await supabase.from("videos").select("*");
      if (error) {
        throw error;
      }
      res.status(200).json(data);
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
      const { data, error } = await supabase
        .from("videos")
        .insert({ title, url, rating })
        .single();
      if (error) {
        throw error;
      }
      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  });

// Get the video with the ID

app.get("/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data, error } = await supabase.from("videos").select("*").eq("id", id).single();
      if (error) {
        throw error;
      }
      if (data) {
        res.json(data);
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
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) {
        throw error;
      }
      res.json({ result: "success", message: "Video deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "failure", message: "Video could not be deleted" });
    }
  });

// Upvote a video by ID
app.put("/videos/:id/upvote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data, error } = await supabase
        .from("videos")
        .update({ rating: supabase.raw("rating + 1") })
        .eq("id", id)
        .single();
      if (error) {
        throw error;
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "failure", message: "Video could not be upvoted" });
    }
  });

// Downvote a video by ID
app.put("/videos/:id/downvote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data, error } = await supabase
        .from("videos")
        .update({ rating: supabase.raw("rating - 1") })
        .eq("id", id)
        .single();
      if (error) {
        throw error;
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "failure", message: "Video could not be downvoted" });
    }
  });

app.listen(port, () => console.log(`Listening on port ${port}`));
