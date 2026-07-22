import pool from '../config/db.js';

// Controller to handle creating the table if it missing
const ensureTableExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
};

// GET All Users Controller
export const getUsers = async (req, res) => {
  try {
    // 1. Ensure table exists before running SELECT
    await ensureTableExists();

    // 2. Fetch users
    const [users] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST New User Controller
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // 1. Ensure table exists before inserting
    await ensureTableExists();

    // 2. Insert record
    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: error.message });
  }
};