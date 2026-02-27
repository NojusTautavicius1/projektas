import db from "../db/mysql.js";

const tableName = "projects";

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY sort_order ASC`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function insert(data) {
  try {
    const [result] = await db.query(
      `INSERT INTO ${tableName} (title, description, image, demo_url, github_url, tags, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.title, data.description, data.image || null, data.demo_url || null, data.github_url || null, data.tags || null, data.category || null, data.sort_order || 0]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function update(id, data) {
  try {
    // Build query dynamically to only update image if provided
    let query = `UPDATE ${tableName} SET title = ?, description = ?, demo_url = ?, github_url = ?, tags = ?, category = ?, sort_order = ?, publish_date = ?`;
    let params = [data.title, data.description, data.demo_url || null, data.github_url || null, data.tags || null, data.category || null, data.sort_order, data.publish_date];
    
    if (data.image) {
      query += `, image = ?`;
      params.push(data.image);
    }
    
    query += ` WHERE id = ?`;
    params.push(id);
    
    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function destroy(id) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}
