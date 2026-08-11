const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DATA_DIR = path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "blog.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

function getAllPosts() {
  return db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
}

function getPost(id) {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

function createPost({ title, content }) {
  const result = db
    .prepare("INSERT INTO posts (title, content) VALUES (?, ?)")
    .run(title, content);
  return getPost(result.lastInsertRowid);
}

function updatePost(id, { title, content }) {
  db.prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?").run(
    title,
    content,
    id
  );
  return getPost(id);
}

module.exports = { getAllPosts, getPost, createPost, updatePost };
