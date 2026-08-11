const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/list", { posts: db.getAllPosts() });
});

router.get("/new", (req, res) => {
  res.render("admin/new");
});

router.post("/new", (req, res) => {
  const { title, content } = req.body;
  const post = db.createPost({ title, content });
  res.redirect(`/posts/${post.id}`);
});

router.get("/edit/:id", (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("admin/edit", { post });
});

router.post("/edit/:id", (req, res) => {
  const { title, content } = req.body;
  const post = db.updatePost(req.params.id, { title, content });
  res.redirect(`/posts/${post.id}`);
});

module.exports = router;
