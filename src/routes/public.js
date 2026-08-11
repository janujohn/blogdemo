const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

function formatDate(sqliteDatetime) {
  return new Date(sqliteDatetime + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

router.get("/posts/:id", (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("post", {
    post,
    formattedDate: formatDate(post.created_at),
    readingTime: estimateReadingTime(post.content),
    paragraphs: post.content.split(/\n+/).filter((p) => p.trim().length > 0),
  });
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
