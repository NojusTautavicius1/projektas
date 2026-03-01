import db from "../db/mysql.js";

const tableName = "services";

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY sort_order ASC`);
    // Parse features JSON string to array
    return rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]')
    }));
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectActive = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE is_active = 1 ORDER BY sort_order ASC`);
    // Parse features JSON string to array
    return rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]')
    }));
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    if (rows[0]) {
      rows[0].features = JSON.parse(rows[0].features || '[]');
    }
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function insert(data) {
  try {
    const features = typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []);
    
    const [result] = await db.query(
      `INSERT INTO ${tableName} (name, icon, price, delivery_time, description, features, revisions, is_popular, is_active, sort_order, color, border_color, bg_color, icon_color) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name, 
        data.icon || 'Zap', 
        data.price, 
        data.delivery_time, 
        data.description, 
        features, 
        data.revisions, 
        data.is_popular || 0, 
        data.is_active !== undefined ? data.is_active : 1, 
        data.sort_order || 0,
        data.color || 'from-blue-500 to-cyan-500',
        data.border_color || 'border-blue-500/30',
        data.bg_color || 'bg-blue-500/10',
        data.icon_color || 'text-blue-400'
      ]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function update(id, data) {
  try {
    const features = typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []);
    
    const [result] = await db.query(
      `UPDATE ${tableName} 
       SET name = ?, icon = ?, price = ?, delivery_time = ?, description = ?, features = ?, revisions = ?, 
           is_popular = ?, is_active = ?, sort_order = ?, color = ?, border_color = ?, bg_color = ?, icon_color = ?
       WHERE id = ?`,
      [
        data.name, 
        data.icon, 
        data.price, 
        data.delivery_time, 
        data.description, 
        features, 
        data.revisions, 
        data.is_popular || 0, 
        data.is_active !== undefined ? data.is_active : 1, 
        data.sort_order || 0,
        data.color,
        data.border_color,
        data.bg_color,
        data.icon_color,
        id
      ]
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
