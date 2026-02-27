import db from '../db/mysql.js';

const tableName = 'content_sections';

// Get all content sections
export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY section ASC`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Get content by section name
export const selectBySection = async (section) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE section = ?`, [section]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Get content by ID
export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Insert new content section
export const insert = async (data) => {
  try {
    const [result] = await db.query(
      `INSERT INTO ${tableName} (section, title, content, image, data) VALUES (?, ?, ?, ?, ?)`,
      [data.section, data.title, data.content, data.image || null, JSON.stringify(data.data || {})]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Update existing content
export const update = async (id, data) => {
  try {
    const fields = [];
    const values = [];
    
    if (data.section !== undefined) {
      fields.push('section = ?');
      values.push(data.section);
    }
    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(data.content);
    }
    if (data.image !== undefined) {
      fields.push('image = ?');
      values.push(data.image);
    }
    if (data.data !== undefined) {
      fields.push('data = ?');
      // Only stringify if it's not already a string
      values.push(typeof data.data === 'string' ? data.data : JSON.stringify(data.data));
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const [result] = await db.query(
      `UPDATE ${tableName} SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log('Update error:', err);
    return false;
  }
}

// Delete content section
export const destroy = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}
