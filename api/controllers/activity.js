import pool from '../db/mysql.js';

// Create activity_log table if it doesn't exist
const createTableIfNotExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS activity_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      user_email VARCHAR(255),
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50),
      entity_id INT,
      description TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    )
  `;
  
  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Error creating activity_log table:', error);
  }
};

// Initialize table on import
createTableIfNotExists();

// Log activity
export const logActivity = async (userId, userEmail, action, entityType = null, entityId = null, description = null, ipAddress = null) => {
  try {
    await pool.query(
      'INSERT INTO activity_log (user_id, user_email, action, entity_type, entity_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, userEmail, action, entityType, entityId, description, ipAddress]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// GET /api/activity - Get all activity logs
export const getAllActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const [rows] = await pool.query(
      'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM activity_log');
    const total = countResult[0].total;

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    next({ message: 'Failed to fetch activity logs' });
  }
};

// GET /api/activity/stats - Get activity statistics
export const getActivityStats = async (req, res, next) => {
  try {
    // Get activities by action type
    const [actionStats] = await pool.query(`
      SELECT action, COUNT(*) as count
      FROM activity_log
      GROUP BY action
      ORDER BY count DESC
    `);

    // Get activities by day (last 7 days)
    const [dailyStats] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM activity_log
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get most active users
    const [userStats] = await pool.query(`
      SELECT 
        user_email,
        COUNT(*) as activity_count
      FROM activity_log
      WHERE user_email IS NOT NULL
      GROUP BY user_email
      ORDER BY activity_count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        actionStats,
        dailyStats,
        userStats
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    next({ message: 'Failed to fetch activity statistics' });
  }
};

// DELETE /api/activity/:id - Delete activity log
export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM activity_log WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.json({
      success: true,
      message: 'Activity log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity log:', error);
    next({ message: 'Failed to delete activity log' });
  }
};
