import db, { dbDialect } from '../db/mysql.js';

const tableName = 'reviews';

const createTableIfNotExists = async () => {
  const createTableQuery = dbDialect === 'postgres'
    ? `
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        rating INTEGER NOT NULL DEFAULT 5,
        text TEXT NOT NULL,
        project_type VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    : `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        rating INT NOT NULL DEFAULT 5,
        text TEXT NOT NULL,
        project_type VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

  try {
    await db.query(createTableQuery);
  } catch (error) {
    console.error('Error creating reviews table:', error);
  }
};

createTableIfNotExists();

export const list = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, role, company, rating, text, project_type, created_at FROM ${tableName} ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500);
    next({ message: 'Nepavyko gauti atsiliepimu' });
  }
};

export const create = async (req, res, next) => {
  try {
    const { rating, text, project_type, company, role, name } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Atsiliepimo tekstas privalomas' });
    }

    const parsedRating = Number.parseInt(rating, 10);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'Ivertinimas turi buti nuo 1 iki 5' });
    }

    const displayName = (name && String(name).trim()) || req.user.email;

    const [result] = await db.query(
      `INSERT INTO ${tableName} (user_id, name, role, company, rating, text, project_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id || null,
        displayName,
        role ? String(role).trim() : null,
        company ? String(company).trim() : null,
        parsedRating,
        String(text).trim(),
        project_type ? String(project_type).trim() : null,
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Atsiliepimas issaugotas' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500);
    next({ message: 'Nepavyko issaugoti atsiliepimo' });
  }
};
