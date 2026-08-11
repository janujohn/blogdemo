const express = require('express');
const path = require('path');
const { getAllPosts, getPost, createPost, updatePost } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const posts = getAllPosts();
  res.render('index', { posts });
});

app.get('/posts/:id', (req, res) => {
  const post = getPost(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

app.get('/admin', (req, res) => {
  const posts = getAllPosts();
  res.render('admin/list', { posts });
});

app.get('/admin/new', (req, res) => {
  res.render('admin/new');
});

app.post('/admin/posts', (req, res) => {
  const { title, body } = req.body;
  createPost(title, body);
  res.redirect('/admin');
});

app.get('/admin/edit/:id', (req, res) => {
  const post = getPost(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('admin/edit', { post });
});

app.post('/admin/posts/:id', (req, res) => {
  const { title, body } = req.body;
  updatePost(req.params.id, title, body);
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`Blog app listening on port ${PORT}`);
});
