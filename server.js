import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
// Ensure the server can handle the Base64 image data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));

const sql = sqlite3.verbose();
const dbPath = path.resolve(__dirname, 'blog.db');

const db = new sql.Database(dbPath, (err) => {
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
        const seedData = [
          {
            id: '1',
            title: 'Welcome to the Future of Blogging',
            content: 'This is a simulated full-stack environment. SQLite for database, Node.js for backend, React 19 for frontend.',
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

app.get('/api/posts', (req, res) => {
  const { q } = req.query;
  let sqlQuery = "SELECT * FROM posts ORDER BY createdAt DESC";
  let params = [];

  if (q) {
    sqlQuery = "SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt DESC";
    params = [`%${q}%`, `%${q}%`];
  }

  db.all(sqlQuery, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/posts/:id', (req, res) => {
  db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row || null);
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, excerpt, imageUrl, createdAt, author } = req.body;
  const id = randomUUID();

  const sqlQuery = "INSERT INTO posts (id, title, content, excerpt, imageUrl, createdAt, author) VALUES (?,?,?,?,?,?,?)";
  const params = [id, title, content, excerpt, imageUrl, createdAt, author];

  db.run(sqlQuery, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id, title, content, excerpt, imageUrl, createdAt, author });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  db.run("DELETE FROM posts WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});