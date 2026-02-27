import pool from "../db/mysql.js";

// Get all feature boxes
export const selectAll = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feature_boxes ORDER BY section, sort_order, id"
    );
    return rows;
  } catch (err) {
    console.error("Error fetching feature boxes:", err);
    return null;
  }
};

// Get feature boxes by section
export const selectBySection = async (section) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feature_boxes WHERE section = ? ORDER BY sort_order, id",
      [section]
    );
    return rows;
  } catch (err) {
    console.error("Error fetching feature boxes by section:", err);
    return null;
  }
};

// Get feature box by ID
export const selectById = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feature_boxes WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Error fetching feature box:", err);
    return null;
  }
};

// Insert new feature box
export const insert = async (data) => {
  try {
    const { section, label, icon, description, sort_order } = data;
    
    const [result] = await pool.query(
      `INSERT INTO feature_boxes (section, label, icon, description, sort_order) 
       VALUES (?, ?, ?, ?, ?)`,
      [section, label, icon || 'Code2', description || '', sort_order || 0]
    );
    
    return result.insertId;
  } catch (err) {
    console.error("Error inserting feature box:", err);
    return null;
  }
};

// Update feature box
export const update = async (id, data) => {
  try {
    const { section, label, icon, description, sort_order } = data;
    
    const [result] = await pool.query(
      `UPDATE feature_boxes 
       SET section = ?, label = ?, icon = ?, description = ?, sort_order = ?
       WHERE id = ?`,
      [section, label, icon, description, sort_order, id]
    );
    
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error updating feature box:", err);
    return false;
  }
};

// Delete feature box
export const destroy = async (id) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM feature_boxes WHERE id = ?",
      [id]
    );
    
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error deleting feature box:", err);
    return false;
  }
};

// Update sort order of multiple boxes
export const updateOrder = async (updates) => {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const update of updates) {
        await connection.query(
          "UPDATE feature_boxes SET sort_order = ? WHERE id = ?",
          [update.sort_order, update.id]
        );
      }
      
      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Error updating feature box order:", err);
    return false;
  }
};
