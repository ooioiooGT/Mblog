const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 1. Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Database Setup
const dbPath = path.resolve(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

function initDb() {
  // Serialize ensures these run in order, preventing 'no such table' errors on startup
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

    // Check if empty, if so seed data
    db.get("SELECT count(*) as count FROM posts", (err, row) => {
      if (err) {
        console.error("Error checking row count:", err);
        return;
      }
      if (row.count === 0) {
        console.log("Seeding initial data...");
        const seedData = [
          {
            id: '1',
            title: 'Welcome to the Future of Blogging',
            content: 'This is a simulated full-stack environment running entirely in your browser. We are using LocalStorage to mimic a SQLite database and Base64 encoding to handle image "uploads" without a physical server. React 18 and Tailwind CSS power the frontend.',
            excerpt: 'This is a simulated full-stack environment running entirely in your browser...',
            createdAt: Date.now(),
            author: 'Admin',
            imageUrl: 'https://picsum.photos/800/400'
          },
          {
            id: '2',
            title: 'Understanding React Hooks',
            content: 'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. The most common hooks are useState and useEffect, which manage local state and side effects respectively.',
            excerpt: 'Hooks are a new addition in React 16.8. They let you use state...',
            createdAt: Date.now() - 86400000,
            author: 'DevTeam',
            imageUrl: 'https://picsum.photos/800/401'
          }
        ];
        
        const stmt = db.prepare("INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)");
        seedData.forEach(post => {
          stmt.run(post.id, post.title, post.content, post.excerpt, post.imageUrl, post.createdAt, post.author);
        });
        stmt.finalize();
      }
    });
  });
}

// --- API Routes ---

// Get all posts (with search)
app.get('/api/posts', (req, res) => {
  const { q } = req.query;
  let sql = "SELECT * FROM posts ORDER BY createdAt DESC";
  let params = [];

  if (q) {
    sql = "SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC";
    params = [`%${q}%`, `%${q}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const sql = "SELECT * FROM posts WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
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
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      id, title, content, excerpt, imageUrl, createdAt, author
    });
  });
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  const sql = "DELETE FROM posts WHERE id = ?";
  db.run(sql, req.params.id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

// --- Catch-All Route (Must be last) ---
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});