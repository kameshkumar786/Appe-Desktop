const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
// for remove port read document kamesh
// https://medium.com/@sahni_hargun/rest-api-with-node-js-express-js-and-sqlite3-6e55f8580151

const app = express();
app.use(cors());

const port = 5000;

app.use(bodyParser.json());

const db = new sqlite3.Database('./data.db');

const getTableFields = (table) => {
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      const columnNames = rows.map(row => row.name);
      console.log(`Column names: ${columnNames.join(', ')}`);
    }
  });
}

const checkAndCreateDoctypeRow = () => {
  
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS "tabDocType" (
  "name" TEXT NOT NULL,
  "creation" TEXT DEFAULT NULL,
  "modified" TEXT DEFAULT NULL,
  "modified_by" TEXT DEFAULT NULL,
  "owner" TEXT DEFAULT NULL,
  "docstatus" INTEGER NOT NULL DEFAULT 0,
  "idx" INTEGER NOT NULL DEFAULT 0,
  "search_fields" TEXT DEFAULT NULL,
  "issingle" INTEGER NOT NULL DEFAULT 0,
  "is_virtual" INTEGER NOT NULL DEFAULT 0,
  "is_tree" INTEGER NOT NULL DEFAULT 0,
  "istable" INTEGER NOT NULL DEFAULT 0,
  "editable_grid" INTEGER NOT NULL DEFAULT 1,
  "track_changes" INTEGER NOT NULL DEFAULT 0,
  "module" TEXT DEFAULT NULL,
  "restrict_to_domain" TEXT DEFAULT NULL,
  "app" TEXT DEFAULT NULL,
  "autoname" TEXT DEFAULT NULL,
  "naming_rule" TEXT DEFAULT NULL,
  "title_field" TEXT DEFAULT NULL,
  "image_field" TEXT DEFAULT NULL,
  "timeline_field" TEXT DEFAULT NULL,
  "sort_field" TEXT DEFAULT 'modified',
  "sort_order" TEXT DEFAULT 'DESC',
  "description" TEXT DEFAULT NULL,
  "colour" TEXT DEFAULT NULL,
  "read_only" INTEGER NOT NULL DEFAULT 0,
  "in_create" INTEGER NOT NULL DEFAULT 0,
  "menu_index" INTEGER DEFAULT NULL,
  "parent_node" TEXT DEFAULT NULL,
  "smallicon" TEXT DEFAULT NULL,
  "allow_copy" INTEGER NOT NULL DEFAULT 0,
  "allow_rename" INTEGER NOT NULL DEFAULT 1,
  "allow_import" INTEGER NOT NULL DEFAULT 0,
  "hide_toolbar" INTEGER NOT NULL DEFAULT 0,
  "track_seen" INTEGER NOT NULL DEFAULT 0,
  "max_attachments" INTEGER NOT NULL DEFAULT 0,
  "print_outline" TEXT DEFAULT NULL,
  "document_type" TEXT DEFAULT NULL,
  "icon" TEXT DEFAULT NULL,
  "color" TEXT DEFAULT NULL,
  "tag_fields" TEXT DEFAULT NULL,
  "subject" TEXT DEFAULT NULL,
  "_last_update" TEXT DEFAULT NULL,
  "engine" TEXT DEFAULT 'InnoDB',
  "default_print_format" TEXT DEFAULT NULL,
  "is_submittable" INTEGER NOT NULL DEFAULT 0,
  "show_name_in_global_search" INTEGER NOT NULL DEFAULT 0,
  "_user_tags" TEXT DEFAULT NULL,
  "custom" INTEGER NOT NULL DEFAULT 0,
  "beta" INTEGER NOT NULL DEFAULT 0,
  "has_web_view" INTEGER NOT NULL DEFAULT 0,
  "allow_guest_to_view" INTEGER NOT NULL DEFAULT 0,
  "route" TEXT DEFAULT NULL,
  "is_published_field" TEXT DEFAULT NULL,
  "website_search_field" TEXT DEFAULT NULL,
  "email_append_to" INTEGER NOT NULL DEFAULT 0,
  "subject_field" TEXT DEFAULT NULL,
  "sender_field" TEXT DEFAULT NULL,
  "show_title_field_in_link" INTEGER NOT NULL DEFAULT 0,
  "migration_hash" TEXT DEFAULT NULL,
  "translated_doctype" INTEGER NOT NULL DEFAULT 0,
  "is_calendar_and_gantt" INTEGER NOT NULL DEFAULT 0,
  "quick_entry" INTEGER NOT NULL DEFAULT 0,
  "track_views" INTEGER NOT NULL DEFAULT 0,
  "queue_in_background" INTEGER NOT NULL DEFAULT 0,
  "documentation" TEXT DEFAULT NULL,
  "nsm_parent_field" TEXT DEFAULT NULL,
  "allow_events_in_timeline" INTEGER NOT NULL DEFAULT 0,
  "allow_auto_repeat" INTEGER NOT NULL DEFAULT 0,
  "make_attachments_public" INTEGER NOT NULL DEFAULT 0,
  "default_view" TEXT DEFAULT NULL,
  "force_re_route_to_default_view" INTEGER NOT NULL DEFAULT 0,
  "show_preview_popup" INTEGER NOT NULL DEFAULT 0,
  "default_email_template" TEXT DEFAULT NULL,
  "sender_name_field" TEXT DEFAULT NULL,
  "index_web_pages_for_search" INTEGER NOT NULL DEFAULT 1,
  "_comments" TEXT DEFAULT NULL,
  "_assign" TEXT DEFAULT NULL,
  "_liked_by" TEXT DEFAULT NULL,
  PRIMARY KEY ("name")
)`);

  db.run(`CREATE TABLE IF NOT EXISTS "tabDocField" (
  "name" TEXT NOT NULL,
  "creation" TEXT DEFAULT NULL,
  "modified" TEXT DEFAULT NULL,
  "modified_by" TEXT DEFAULT NULL,
  "owner" TEXT DEFAULT NULL,
  "docstatus" INTEGER NOT NULL DEFAULT 0,
  "parent" TEXT DEFAULT NULL,
  "parentfield" TEXT DEFAULT NULL,
  "parenttype" TEXT DEFAULT NULL,
  "idx" INTEGER NOT NULL DEFAULT 0,
  "fieldname" TEXT DEFAULT NULL,
  "label" TEXT DEFAULT NULL,
  "oldfieldname" TEXT DEFAULT NULL,
  "fieldtype" TEXT DEFAULT 'Data',
  "oldfieldtype" TEXT DEFAULT NULL,
  "options" TEXT DEFAULT NULL,
  "search_index" INTEGER NOT NULL DEFAULT 0,
  "show_dashboard" INTEGER NOT NULL DEFAULT 0,
  "hidden" INTEGER NOT NULL DEFAULT 0,
  "set_only_once" INTEGER NOT NULL DEFAULT 0,
  "allow_in_quick_entry" INTEGER NOT NULL DEFAULT 0,
  "print_hide" INTEGER NOT NULL DEFAULT 0,
  "report_hide" INTEGER NOT NULL DEFAULT 0,
  "reqd" INTEGER NOT NULL DEFAULT 0,
  "bold" INTEGER NOT NULL DEFAULT 0,
  "in_global_search" INTEGER NOT NULL DEFAULT 0,
  "collapsible" INTEGER NOT NULL DEFAULT 0,
  "unique" INTEGER NOT NULL DEFAULT 0,
  "no_copy" INTEGER NOT NULL DEFAULT 0,
  "allow_on_submit" INTEGER NOT NULL DEFAULT 0,
  "show_preview_popup" INTEGER NOT NULL DEFAULT 0,
  "trigger" TEXT DEFAULT NULL,
  "collapsible_depends_on" TEXT DEFAULT NULL,
  "mandatory_depends_on" TEXT DEFAULT NULL,
  "read_only_depends_on" TEXT DEFAULT NULL,
  "depends_on" TEXT DEFAULT NULL,
  "permlevel" INTEGER NOT NULL DEFAULT 0,
  "ignore_user_permissions" INTEGER NOT NULL DEFAULT 0,
  "width" TEXT DEFAULT NULL,
  "print_width" TEXT DEFAULT NULL,
  "columns" INTEGER NOT NULL DEFAULT 0,
  "default" TEXT DEFAULT NULL,
  "description" TEXT DEFAULT NULL,
  "in_list_view" INTEGER NOT NULL DEFAULT 0,
  "fetch_if_empty" INTEGER NOT NULL DEFAULT 0,
  "in_filter" INTEGER NOT NULL DEFAULT 0,
  "remember_last_selected_value" INTEGER NOT NULL DEFAULT 0,
  "ignore_xss_filter" INTEGER NOT NULL DEFAULT 0,
  "print_hide_if_no_value" INTEGER NOT NULL DEFAULT 0,
  "allow_bulk_edit" INTEGER NOT NULL DEFAULT 0,
  "in_standard_filter" INTEGER NOT NULL DEFAULT 0,
  "in_preview" INTEGER NOT NULL DEFAULT 0,
  "read_only" INTEGER NOT NULL DEFAULT 0,
  "precision" TEXT DEFAULT NULL,
  "max_height" TEXT DEFAULT NULL,
  "length" INTEGER NOT NULL DEFAULT 0,
  "translatable" INTEGER NOT NULL DEFAULT 0,
  "hide_border" INTEGER NOT NULL DEFAULT 0,
  "hide_days" INTEGER NOT NULL DEFAULT 0,
  "hide_seconds" INTEGER NOT NULL DEFAULT 0,
  "non_negative" INTEGER NOT NULL DEFAULT 0,
  "is_virtual" INTEGER NOT NULL DEFAULT 0,
  "sort_options" INTEGER NOT NULL DEFAULT 0,
  "fetch_from" TEXT DEFAULT NULL,
  "documentation_url" TEXT DEFAULT NULL,
  PRIMARY KEY ("name"),
  KEY "parent" ("parent"),
  KEY "label" ("label"),
  KEY "fieldtype" ("fieldtype"),
  KEY "fieldname" ("fieldname")
)`);


  // db.run(`CREATE TABLE IF NOT EXISTS docdata (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS companylist (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS ledgers (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS groups (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS stockgroups (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS vouchers (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS sales_report (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);
  // db.run(`CREATE TABLE IF NOT EXISTS report (mid INTEGER PRIMARY KEY AUTOINCREMENT)`);

  checkAndCreateDoctypeRow();
});


const createDoctypeRow = (doctypeName, docfieldsData) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO doctype (name, creation, status, description) VALUES (?, ?, ?, ?)`, 
      `${doctypeName}`, new Date(), 'active', '', 
      (err, row) => {
        if (err) {
          return reject(err);
        }
        const doctypeId = db.lastID;
        const docfieldsInsertPromises = docfieldsData.map((docfield, index) => {
          console.log(docfield)
          return new Promise((resolve, reject) => {
            db.run(`INSERT INTO docfields (id, label, fieldname, fieldtype, options, reqd, chield, creation, mofified, module, doctype, default_value, fetch_from, fetchable_field, table_view, graph_view, export_view, menu) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
              index + 1, docfield.label, docfield.fieldname, docfield.fieldtype, docfield.options, docfield.reqd, docfield.chield, new Date(), new Date(), docfield.module, doctypeId, docfield.default_value, docfield.fetch_from, docfield.fetchable_field, docfield.table_view, docfield.graph_view, docfield.export_view, docfield.menu, 
              (err, row) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              });
          });
        });
        Promise.all(docfieldsInsertPromises)
          .then(() =>{ 
            createTableForDoctype(doctypeName,docfieldsData)
            resolve(doctypeId)

          })
          .catch(reject);
      });
  });
};

const createTableForDoctype = (doctypeId, docfieldsData) => {
  const tableName = `tbl_${doctypeId}`;
  const columns = docfieldsData.map((docfield) => {
    let columnType = '';
    switch (docfield.type) {
      case 'text':
        columnType = 'TEXT';
        break;
      case 'int':
        columnType = 'INTEGER';
        break;
      // Add more data types as needed
      default:
        columnType = 'TEXT';
    }
    return `${docfield.name} ${columnType}`;
  }).join(', ');
  const sql = `CREATE TABLE IF NOT EXISTS [${tableName}] (${columns})`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Created table ${tableName} for doctype ${doctypeId}`);
    }
  });
};

const updateDoctypeRow = (doctype, doctypeName, docfieldsData) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE doctype SET name = ?, creation = ?, status = ?, description = ? WHERE mid = ?`, 
      doctypeName, new Date(), 'active', '', doctype, 
      (err, row) => {
        if (err) {
          return reject(err);
        }
        const updateDocfieldsPromises = docfieldsData.map((docfield, index) => {
          return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM docfields WHERE id = ? AND doctype = ?`, 
              index + 1, doctype, 
              (err, row) => {
                if (err) {
                  return reject(err);
                }
                if (row) {
                  // Update existing row
                  db.run(`UPDATE docfields SET label = ?, fieldname = ?, fieldtype = ?, options = ?, reqd = ?, chield = ?, creation = ?, mofified = ?, module = ?, doctype = ?, default_value = ?, fetch_from = ?, fetchable_field = ?, table_view = ?, graph_view = ?, export_view = ?, menu = ? WHERE id = ? AND doctype = ?`, 
                    docfield.label, docfield.fieldname, docfield.fieldtype, docfield.options, docfield.reqd, docfield.chield, new Date(), new Date(), docfield.module, doctype, docfield.default_value, docfield.fetch_from, docfield.fetchable_field, docfield.table_view, docfield.graph_view, docfield.export_view, docfield.menu, index + 1, doctype, 
                    (err, row) => {
                      if (err) {
                        return reject(err);
                      }
                      resolve();
                    });
                } else {
                  // Insert new row
                  db.run(`INSERT INTO docfields (label, fieldname, fieldtype, options, reqd, chield, creation, mofified, module, doctype, default_value, fetch_from, fetchable_field, table_view, graph_view, export_view, menu, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    docfield.label, docfield.fieldname, docfield.fieldtype, docfield.options, docfield.reqd, docfield.chield, new Date(), new Date(), docfield.module, doctype, docfield.default_value, docfield.fetch_from, docfield.fetchable_field, docfield.table_view, docfield.graph_view, docfield.export_view, docfield.menu, index + 1, 
                    (err, row) => {
                      if (err) {
                        return reject(err);
                      }
                      resolve();
                    });
                }
              });
          });
        });
        Promise.all(updateDocfieldsPromises)
          .then(() => {
            updateTableForDoctype(doctypeName, docfieldsData)
            resolve(doctype)
          })
          .catch(reject);
      });
  });
};

const updateTableForDoctype = (doctype, docfieldsData) => {
  const tableName = `tbl_${doctype}`;
  const columns = docfieldsData.map((docfield) => {
    let columnType = '';
    switch (docfield.type) {
      case 'text':
        columnType = 'TEXT';
        break;
      case 'int':
        columnType = 'INTEGER';
        break;
      // Add more data types as needed
      default:
        columnType = 'TEXT';
    }
    return `${docfield.name} ${columnType}`;
  }).join(', ');
  const sql = `ALTER TABLE ${tableName} (${columns})`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Updated table ${tableName} for doctype ${doctype}`);
    }
  });
};

// Example usage:
// const doctypeName = 'Doctype';
// const docfieldsData = [
//   {
//     label: 'Doctype Name',
//     fieldname: 'field1',
//     fieldtype: 'text',
//     options: '',
//     reqd: 1,
//     chield: '',
//     module: 'My Module',
//     default_value: '',
//     fetch_from: '',
//     fetchable_field: '',
//     table_view: '1',
//     graph_view: '1',
//     export_view: '1',
//     menu: '1',
//     doctype:'Doctype'
//   },
//   {
//     label: 'Field 2',
//     fieldname: 'field2',
//     fieldtype: 'int',
//     options: '',
//     reqd: 0,
//     chield: '',
//     module: 'My Module',
//     default_value: '',
//     fetch_from: '',
//     fetchable_field: '',
//     table_view: '1',
//     graph_view: '1',
//     export_view: '1',
//     menu: '1',
//     doctype:'Doctype'

//   }
// ];

// createDoctypeRow(doctypeName, docfieldsData)
//   .then((doctypeId) => {
//     console.log(`Created new doctype row with ID ${doctypeId}`);
//   })
//   .catch((err) => {
//     console.error(err);
//   });


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


app.put('/api/update-doctype/:doctype', async (req, res) => {
  const doctype = req.params.doctype;
  const doctypeName = req.body.doctypeName;
  const docfieldsData = req.body.docfieldsData;

  try {
    await updateDoctypeRow(doctype, doctypeName, docfieldsData);
    res.json({ message: `Doctype ${doctype} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the doctype');
  }
});


app.post('/api/create-doctype/:doctype', async (req, res) => {
  // const doctype = req.params.doctype;
  const doctypeName = req.body.doctypeName;
  const docfieldsData = req.body.docfieldsData;

  try {
    await createDoctypeRow( doctypeName, docfieldsData);
    res.json({ message: `Doctype ${doctype} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the doctype');
  }
});

// API endpoint to receive data from the frontend
app.post('/api/store-data/:table', async (req, res) => {
  const table = req.params.table.includes(' ') ? `[${req.params.table}]` : req.params.table;
  const data = req.body;

  try {
    await addMissingColumns(table, data);

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



// for delete table
app.get('/api/delete-table/:table', (req, res) => {
  const table = req.params.table.includes(' ') ? `[${req.params.table}]` : req.params.table;
  db.run(`DROP TABLE IF EXISTS ${table}`, err => {
    if (err) {
      console.error(`Error deleting table ${table}:`, err);
      res.status(500).send(`Error deleting table ${table}`);
    } else {
      console.log(`Table ${table} deleted successfully`);
      res.send(`Table ${table} deleted successfully`);
    }
  });
});

// for delete all rows in table
app.get('/api/empty-table/:table', (req, res) => {
  const table = req.params.table.includes(' ') ? `[${req.params.table}]` : req.params.table;
  db.run(`DELETE FROM ${table}`, err => {
    if (err) {
      console.error(`Error emptying table ${table}:`, err);
      res.status(500).send(`Error emptying table ${table}`);
    } else {
      console.log(`Table ${table} emptied successfully`);
      res.send(`Table ${table} emptied successfully`);
    }
  });
});

app.get('/api/table-columns/:table', (req, res) => {
  const table = req.params.table.includes(' ') ? `[${req.params.table}]` : req.params.table;
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(`Error table ${table} ${err}`);

    } else {
      const columnNames = rows.map(row => row.name);
      res.send(`${columnNames.join(', ')}`);

      console.log(`Column names: ${columnNames.join(', ')}`);
    }
  });
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
const fetchDataWithAdvancedFilters = (table, fields, filters, orderBy, groupBy, limit) => {
  return new Promise((resolve, reject) => {
    const fieldList = fields.join(',');
    let filterClause = '';
    let orderByClause = '';
    let groupByClause = '';
    let allclause=''
    const filterValues = [];

    if (filters && filters!='' && filters!=[]) {
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
    const sql = `SELECT ${fieldList} FROM ${table.includes(' ') ? `\`${table}\`` : table} ${filterClause} ${groupByClause} ${orderByClause} LIMIT ${limit?limit:20}`;

    // const sql = `SELECT ${fieldList} FROM ${table.includes(' ') ? [table] : table} ${filterClause} ${groupByClause} ${orderByClause} LIMIT ${limit?limit:20}`;

    db.all(sql, filterValues, (err, rows) => {
      if (err) {
        if (err.code === 'SQLITE_ERROR' && err.message.includes('no such table')) {
          return reject(new Error(`Table "${table}" not found.`));
        }
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
  const limit = req.query.limit || 20;

  try {
    const data = await fetchDataWithAdvancedFilters(table, fields, filters, orderBy, groupBy,limit);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('table not foundAn error occurred while fetching the data.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
