const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
  db.run('CREATE TABLE doctype (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
  db.run('CREATE TABLE docfields (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

});


app.post('/api/create-table', (req, res) => {
  const { tableName, data } = req.body;
  const fields = Object.keys(data);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT)`, (err) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }

      const fieldDefs = fields.map((field) => `${field} TEXT`);
      db.run(`ALTER TABLE ${tableName} ADD COLUMN ${fieldDefs.join(', ')}`, (err) => {
        if (err) {
          res.status(500).send(err.message);
          return;
        }

        const placeholders = fields.map((field) => `?`);
        const values = fields.map((field) => data[field]);
        db.run(`INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`, values, (err) => {
          if (err) {
            res.status(500).send(err.message);
            return;
          }

          res.status(201).json({ message: `Table ${tableName} created and record inserted` });
        });
      });
    });
  });
});

app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});


app.get('/api/doctype', (req, res) => {
  db.all('SHOW TABLES', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO items (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE items SET name = ? WHERE id = ?', [name, id], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json({ updated: this.changes });
  });
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM items WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json({ deleted: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
