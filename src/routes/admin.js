const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const posts = db.prepare('SELECT id, title, created_at FROM posts ORDER BY created_at DESC').all();
  res.render('admin/list', { posts });
});

router.get('/new', (req, res) => {
  res.render('admin/new');
});

router.post('/new', (req, res) => {
  const { title, content } = req.body;
  db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title, content);
  res.redirect('/admin');
});

router.get('/edit/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('admin/edit', { post });
});

router.post('/edit/:id', (req, res) => {
  const { title, content } = req.body;
  db.prepare('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, content, req.params.id);
  res.redirect('/admin');
});

router.post('/delete/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
