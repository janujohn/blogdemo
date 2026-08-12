const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC').all();
  res.json(posts);
});

router.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

router.get('/post/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

module.exports = router;
