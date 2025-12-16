const express = import('express');
const sqlite3 = import ('sqlite3').verbose();
const cors = import('cors');
const path = import('path');
const { randomUUID } = import('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
// Increase payload limit for Base64 images
app.use(express.json({ limit: '50mb' }));

// 1. Serve Static Files (Frontend)
// This expects your React build to be in the 'dist' folder
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

    // Seed data if empty
    db.get("SELECT count(*) as count FROM posts", (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        console.log("Seeding initial data...");
        const seedData = [
          {
            id: '1',
            title: 'Welcome to the Future of Blogging',
            content: 'This is a simulated full-stack environment. We are using SQLite for the database and Node.js for the backend. React 19 powers the frontend.',
            excerpt: 'This is a simulated full-stack environment...',
            createdAt: Date.now(),
            author: 'Admin',
            imageUrl: 'https://picsum.photos/800/400'
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
    if (err) {
      console.error(err);
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
// Handles React Client-Side Routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});