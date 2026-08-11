const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

function getAllPosts() {
  return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
}

function getPost(id) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
}

function createPost(title, body) {
  db.prepare('INSERT INTO posts (title, body) VALUES (?, ?)').run(title, body);
}

function updatePost(id, title, body) {
  db.prepare('UPDATE posts SET title = ?, body = ? WHERE id = ?').run(title, body, id);
}

module.exports = { getAllPosts, getPost, createPost, updatePost };
