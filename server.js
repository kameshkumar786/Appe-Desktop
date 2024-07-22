const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 5000; // You can use any port you prefer

// Middleware
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./data.db');


// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS stockitems (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS companylist (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS ledgers (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS groups (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS stockgroups (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS vouchers (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS sales_report (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  db.run(`CREATE TABLE IF NOT EXISTS report (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // Add other tables as needed
});


// Helper function to add missing columns
const addMissingColumns = (table, data) => {
  return new Promise((resolve, reject) => {
    const columns = Object.keys(data[0]);
    db.all(`PRAGMA table_info(${table})`, (err, rows) => {
      if (err) {
        return reject(err);
      }
      const existingColumns = rows.map(row => row.name);
      const addColumnPromises = columns.map(column => {
        if (!existingColumns.includes(column)) {
          return new Promise((resolve, reject) => {
            db.run(`ALTER TABLE ${table} ADD COLUMN ${column} TEXT`, err => {
              if (err) {
                return reject(err);
              } else {
                console.log(`Added column ${column} to table ${table}`);
                resolve();
              }
            });
          });
        }
        return Promise.resolve();
      });

      Promise.all(addColumnPromises)
        .then(() => resolve())
        .catch(reject);
    });
  });
};

// API endpoint to receive data from the frontend
app.post('/api/store-data/:table', async (req, res) => {
  const table = req.params.table;
  const data = req.body;

  try {
    await addMissingColumns(table, data);

    // Create SQL query based on table name
    const placeholders = Object.keys(data[0]).map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${Object.keys(data[0]).join(',')}) VALUES (${placeholders})`;

    const stmt = db.prepare(sql);
    const insertedIds = [];

    db.serialize(() => {
      data.forEach(item => {
        stmt.run(Object.values(item), function (err) {
          if (err) {
            console.error(`Error inserting data into table ${table}:`, err);
          } else {
            insertedIds.push(this.lastID);
          }
        });
      });

      stmt.finalize(() => {
        res.json({ insertedIds });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing your request.');
  }
});



// delete all data
const deleteAllData = () => {
  const tables = ['stockitems', 'companylist', 'ledgers', 'groups', 'stockgroups', 'vouchers', 'sales_report', 'report'];
  tables.forEach(table => {
    db.run(`DELETE FROM ${table}`, err => {
      if (err) {
        console.error(`Error deleting data from table ${table}:`, err);
      } else {
        console.log(`Deleted all data from table ${table}`);
      }
    });
  });
};

// Endpoint to delete all data from all tables
app.post('/api/delete-all-data', (req, res) => {
  deleteAllData();
  res.send('All data deleted from all tables.');
});



// // Function to fetch data with filters
// const fetchDataWithFilters = (table, fields, filters) => {
//   return new Promise((resolve, reject) => {
//     const fieldList = fields.join(',');
//     let filterClause = '';
//     const filterValues = [];

//     if (filters) {
//       filterClause = 'WHERE ' + Object.keys(filters).map(key => {
//         filterValues.push(filters[key]);
//         return `${key} = ?`;
//       }).join(' AND ');
//     }

//     const sql = `SELECT ${fieldList} FROM ${table} ${filterClause}`;

//     db.all(sql, filterValues, (err, rows) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(rows);
//     });
//   });
// };

// // Endpoint to fetch data with filters
// //http://localhost:5000/api/fetch-data/stockitems?fields=name,reservedname&filters={%22id%22:%221%22}
// app.get('/api/fetch-data/:table', async (req, res) => {
//   const table = req.params.table;
//   const fields = req.query.fields ? req.query.fields.split(',') : ['*'];
//   const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

//   try {
//     const data = await fetchDataWithFilters(table, fields, filters);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while fetching the data.');
//   }
// });



// Function to fetch data with advanced filters, ordering, and grouping
const fetchDataWithAdvancedFilters = (table, fields, filters, orderBy, groupBy) => {
  return new Promise((resolve, reject) => {
    const fieldList = fields.join(',');
    let filterClause = '';
    let orderByClause = '';
    let groupByClause = '';
    const filterValues = [];

    if (filters) {
      const filterConditions = filters.map(condition => {
        const [field, operator, value] = condition;
        if (operator === 'IN' || operator === 'BETWEEN') {
          filterValues.push(...value);
          return `${field} ${operator} (${value.map(() => '?').join(',')})`;
        } else {
          filterValues.push(value);
          return `${field} ${operator} ?`;
        }
      }).join(' AND ');

      filterClause = `WHERE ${filterConditions}`;
    }

    if (orderBy) {
      orderByClause = `ORDER BY ${orderBy}`;
    }

    if (groupBy) {
      groupByClause = `GROUP BY ${groupBy}`;
    }

    const sql = `SELECT ${fieldList} FROM ${table} ${filterClause} ${groupByClause} ${orderByClause}`;

    db.all(sql, filterValues, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

// Endpoint to fetch data with advanced filters, ordering, and grouping
app.get('/api/fetch-data/:table', async (req, res) => {
  const table = req.params.table;
  const fields = req.query.fields ? req.query.fields.split(',') : ['*'];
  let filters = [];
  if (req.query.filters) {
    try {
      filters = JSON.parse(decodeURIComponent(req.query.filters));
    } catch (error) {
      return res.status(400).send('Invalid filters JSON');
    }
  }
  const orderBy = req.query.orderBy || '';
  const groupBy = req.query.groupBy || '';

  try {
    const data = await fetchDataWithAdvancedFilters(table, fields, filters, orderBy, groupBy);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the data.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
