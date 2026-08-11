const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/posts/:id", (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("post", { post });
});

router.get("/api/posts", (req, res) => {
  res.json(db.getAllPosts());
});

router.get("/api/posts/:id", (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

module.exports = router;
