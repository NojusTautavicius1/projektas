import pool from '../db/mysql.js';

const translateProjectsToEnglish = async () => {
  try {
    console.log('Translating project descriptions to English...');

    // Calculator
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Calculator',
        'Modern design calculator with dark and light theme toggle. Implements all basic mathematical operations with beautiful animated UI.',
        1
      ]
    );
    console.log('✓ Calculator translated');

    // Calendar Generator
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Calendar Generator',
        'Dynamic calendar generator with JavaScript. Automatically generates calendar for any year and month with weekdays and full functionality.',
        2
      ]
    );
    console.log('✓ Calendar Generator translated');

    // Express CRUD System
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Express CRUD System',
        'Full-stack address management system with MySQL database. Implements complete CRUD functionality, MVC architecture and RESTful API.',
        3
      ]
    );
    console.log('✓ Express CRUD System translated');

    // React Learning App
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'React Learning App',
        'React learning project with component architecture and modern hooks. Practical React.js demonstration.',
        4
      ]
    );
    console.log('✓ React Learning App translated');

    // Text Processing System
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Text Processing System',
        'JavaScript application for text processing - string manipulation, search, replacement and formatting. Various algorithms for text analysis.',
        5
      ]
    );
    console.log('✓ Text Processing System translated');

    // Portfolio CMS
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Portfolio CMS',
        'This portfolio project with admin panel and full-stack architecture. Implements content management, authentication, and dynamic content.',
        6
      ]
    );
    console.log('✓ Portfolio CMS translated');

    // Weather App
    await pool.query(
      `UPDATE projects SET 
        title = ?, 
        description = ? 
      WHERE id = ?`,
      [
        'Weather App',
        'A modern and functional web platform built with web programming technologies. Features convenient design, clear navigation and showcases my programming skills and creativity.',
        7
      ]
    );
    console.log('✓ Weather App translated');

    // Check results
    const [projects] = await pool.query('SELECT id, title, description FROM projects ORDER BY sort_order');
    console.log('\n=== Translated Projects ===');
    projects.forEach(p => {
      console.log(`\n${p.id}. ${p.title}`);
      console.log(`   Description: ${p.description}`);
    });

    console.log('\n✓ All projects successfully translated to English!');
    process.exit(0);
  } catch (error) {
    console.error('Error translating projects:', error);
    process.exit(1);
  }
};

translateProjectsToEnglish();
