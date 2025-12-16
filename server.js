import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const verboseSqlite = sqlite3.verbose();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 1. Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Database Setup
const dbPath = path.resolve(__dirname, 'blog.db');
const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      excerpt TEXT,
      imageUrl TEXT,
      createdAt INTEGER,
      author TEXT
    )`);

    db.get("SELECT count(*) as count FROM posts", (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        console.log("Seeding initial data...");
        // (Simplified seed logic for brevity, your original logic works here too)
      }
    });
  });
}

// --- API Routes ---
app.get('/api/posts', (req, res) => {
  const { q } = req.query;
  let sql = "SELECT * FROM posts ORDER BY createdAt DESC";
  let params = [];

  if (q) {
    sql = "SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC";
    params = [`%${q}%`, `%${q}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/posts/:id', (req, res) => {
  db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || null);
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, excerpt, imageUrl, createdAt, author } = req.body;
  const id = randomUUID();
  const sql = "INSERT INTO posts (id, title, content, excerpt, imageUrl, createdAt, author) VALUES (?,?,?,?,?,?,?)";
  db.run(sql, [id, title, content, excerpt, imageUrl, createdAt, author], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id, title, content, excerpt, imageUrl, createdAt, author });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  db.run("DELETE FROM posts WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "deleted", changes: this.changes });
  });
});

// --- Catch-All Route ---
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});