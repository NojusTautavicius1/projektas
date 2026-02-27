import pool from '../db/mysql.js';
import { sendContactNotification } from '../utils/email.js';

// Create contact messages table if it doesn't exist
const createTableIfNotExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    
    // Try to add is_read column if it doesn't exist (for existing tables)
    try {
      await pool.query(`
        ALTER TABLE contact_messages 
        ADD COLUMN is_read BOOLEAN DEFAULT FALSE
      `);
    } catch (alterError) {
      // Ignore error if column already exists
      if (!alterError.message.includes('Duplicate column')) {
        console.error('Error adding is_read column:', alterError);
      }
    }
  } catch (error) {
    console.error('Error creating contact_messages table:', error);
  }
};

// Initialize table on import
createTableIfNotExists();

// POST /api/contact - Create a new contact message
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, message, website } = req.body;

    // Honeypot spam protection: if 'website' field is filled, it's a bot
    if (website) {
      // Silent fail - don't let bots know they were caught
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully!'
      });
    }

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'All fields are required',
        errors: [
          { field: 'name', msg: 'Name is required' },
          { field: 'email', msg: 'Email is required' },
          { field: 'message', msg: 'Message is required' }
        ].filter(err => !req.body[err.field])
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        errors: [{ field: 'email', msg: 'Please provide a valid email address' }]
      });
    }

    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    // Send email notification (async, don't wait for it)
    sendContactNotification(name, email, message).catch(err => {
      console.error('Failed to send email notification:', err);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: result.insertId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    next({ message: 'Failed to send message. Please try again.' });
  }
};

// GET /api/contact - Get all contact messages (for admin use)
export const getAllContactMessages = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    next({ message: 'Failed to fetch messages' });
  }
};

// GET /api/contact/:id - Get a specific contact message
export const getContactMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    next({ message: 'Failed to fetch message' });
  }
};

// DELETE /api/contact/:id - Delete a contact message
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    next({ message: 'Failed to delete message' });
  }
};

// PATCH /api/contact/:id/read - Mark message as read
export const markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    next({ message: 'Failed to update message' });
  }
};
