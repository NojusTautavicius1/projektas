import db from '../db/mysql.js';

const tableName = 'users';

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT id, email, role, status FROM ${tableName}`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const selectByEmail = async (email) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function insert(data) {
  try {
    const [result] = await db.query(`INSERT INTO ${tableName} (email, nickname, password) VALUES (?, ?, ?)`, [data.email, data.nickname, data.password]);
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function update(id, data) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET email = ?, nickname = ?, password = ? WHERE id = ?`, [data.email, data.nickname, data.password, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updatePartial(id, data) {
  try {
    const fields = [];
    const values = [];
    
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(data.nickname);
    }
    if (data.password !== undefined) {
      fields.push('password = ?');
      values.push(data.password);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const [result] = await db.query(
      `UPDATE ${tableName} SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function destroy(id) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updatePassword(id, newPassword) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET password = ? WHERE id = ?`, [newPassword, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateRole(id, role) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET role = ? WHERE id = ?`, [role, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateStatus(id, status) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
} 