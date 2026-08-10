const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const posts = db
    .prepare('SELECT id, title, slug, created_at FROM posts ORDER BY created_at DESC')
    .all();
  res.render('index', { posts });
});

router.get('/posts/:slug', (req, res) => {
  const post = db
    .prepare('SELECT * FROM posts WHERE slug = ?')
    .get(req.params.slug);
  if (!post) return res.status(404).render('not-found');

  const paragraphs = post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const wordCount = post.body.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  res.render('post', { post, paragraphs, readingMinutes });
});

module.exports = router;
