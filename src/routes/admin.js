const express = require('express');
const db = require('../db');
const { uniqueSlug } = require('../slugify');

const router = express.Router();

router.get('/admin', (req, res) => {
  const posts = db
    .prepare('SELECT id, title, slug, updated_at FROM posts ORDER BY updated_at DESC')
    .all();
  res.render('admin/list', { posts });
});

router.get('/admin/new', (req, res) => {
  res.render('admin/form', { post: null });
});

router.post('/admin/new', (req, res) => {
  const { title, body } = req.body;
  const slug = uniqueSlug(db, title);
  db.prepare('INSERT INTO posts (title, slug, body) VALUES (?, ?, ?)').run(title, slug, body);
  res.redirect('/admin');
});

router.get('/admin/:id/edit', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).render('not-found');
  res.render('admin/form', { post });
});

router.post('/admin/:id/edit', (req, res) => {
  const { title, body } = req.body;
  const id = Number(req.params.id);
  const slug = uniqueSlug(db, title, id);
  db.prepare(
    "UPDATE posts SET title = ?, slug = ?, body = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, slug, body, id);
  res.redirect('/admin');
});

router.post('/admin/:id/delete', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(Number(req.params.id));
  res.redirect('/admin');
});

module.exports = router;
