import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

// 1. Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// 2. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Database Setup (Using standard sqlite3)
const verboseSqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, 'blog.db');

const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

// 4. Initialize Table and Seed Data
function initDb() {
  db.serialize(() => {
    // Create Table
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      excerpt TEXT,
      imageUrl TEXT,
      createdAt INTEGER,
      author TEXT
    )`);

    // Check if empty, then seed
    db.get("SELECT count(*) as count FROM posts", (err, row) => {
      if (err) return console.error(err);
      
      if (row.count === 0) {
        console.log("Seeding initial data...");
        const seed1 = [
          '1', 
          'Welcome to your new Blog', 
          'This is your first post running on your Ubuntu server! You can delete this in the admin panel.', 
          'This is your first post...', 
          '', 
          Date.now(), 
          'Admin'
        ];
        
        db.run(
          "INSERT INTO posts (id, title, content, excerpt, imageUrl, createdAt, author) VALUES (?, ?, ?, ?, ?, ?, ?)",
          seed1,
          (err) => {
            if (err) console.error("Seed error:", err);
            else console.log("Seed data inserted.");
          }
        );
      }
    });
  });
}

// --- API Routes ---

// Get all posts
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

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const sql = "SELECT * FROM posts WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || null);
  });
});

// Create post
app.post('/api/posts', (req, res) => {
  const { title, content, excerpt, imageUrl, createdAt, author } = req.body;
  const id = randomUUID();

  const sql = "INSERT INTO posts (id, title, content, excerpt, imageUrl, createdAt, author) VALUES (?,?,?,?,?,?,?)";
  const params = [id, title, content, excerpt, imageUrl, createdAt, author];

  db.run(sql, params, function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id, title, content, excerpt, imageUrl, createdAt, author });
  });
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  const sql = "DELETE FROM posts WHERE id = ?";
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "deleted", changes: this.changes });
  });
});

// --- Catch-All Route (Must be last) ---
app.get('*', (req, res) => {
  // If API request not found
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  // Otherwise serve React
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});