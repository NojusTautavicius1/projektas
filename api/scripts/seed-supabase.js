import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  throw new Error('SUPABASE_DB_URL is not set in api/.env');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const users = [
  [1, 'admin@example.com', 'admin_user', '$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga', 'admin', 1, '2026-01-23 10:24:19+00'],
  [2, 'user@example.com', 'user_one', '$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga', 'user', 1, '2026-01-23 10:24:19+00'],
  [3, 'user2@example.com', 'user_two', '$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga', 'user', 1, '2026-01-23 10:24:19+00'],
  [4, 'user3@example.com', 'user_three', '$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga', 'user', 0, '2026-01-23 10:24:19+00'],
  [5, 'nojustautavicius007@gmail.com', 'nojus', '$2b$10$ugqj70MCUk0b2EsMbvKn5O/ASEliTYUETUzU0EpcRBeINHxwP0maG', 'admin', 1, '2026-01-23 10:31:05+00'],
];

const projects = [
  [1, 'Calculator', 'Modern design calculator with dark and light theme toggle. Implements all basic mathematical operations with beautiful animated UI.', '/images/projects/project-1769163901406-50285141.png', '/projektas/skaiciuotuvas/index.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/skaiciuotuvas', 'JavaScript,HTML5,CSS3,Animations', 'Frontend', 1, '2026-01-20 00:00:00+00'],
  [2, 'Calendar Generator', 'Dynamic calendar generator with JavaScript. Automatically generates calendar for any year and month with weekdays and full functionality.', '/images/projects/project-1769165359426-420697133.png', '/projektas/kalendorius/kalendorius.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/kalendorius', 'JavaScript,DOM,Date API', 'Frontend', 2, '2026-01-21 00:00:00+00'],
  [3, 'Express CRUD System', 'Full-stack address management system with MySQL database. Implements complete CRUD functionality, MVC architecture and RESTful API.', '/images/projects/project-1769165662708-635348042.png', null, 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/express_crud_adresai', 'Node.js,Express,MySQL,EJS,REST API', 'Full Stack', 3, '2026-01-21 00:00:00+00'],
  [4, 'React Learning App', 'React learning project with component architecture and modern hooks. Practical React.js demonstration.', '/images/projects/project-1769166153713-781656743.png', null, 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/reactas', 'React,JSX,Components,Hooks', 'Frontend', 4, '2026-01-21 00:00:00+00'],
  [5, 'Text Processing System', 'JavaScript application for text processing - string manipulation, search, replacement and formatting. Various algorithms for text analysis.', '/images/projects/project-1769166458817-394779570.png', '/projektas/Tekstoapdorojimas/index.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/Tekstoapdorojimas', 'JavaScript,String Methods,Algorithms', 'Frontend', 5, '2026-01-22 00:00:00+00'],
  [6, 'Portfolio CMS', 'This portfolio project with admin panel and full-stack architecture. Implements content management, authentication, and dynamic content.', '/images/projects/project-1769166622075-102421369.png', 'http://localhost:5173', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/projektas', 'React,Node.js,MySQL,JWT,Vite', 'Full Stack', 6, '2026-01-20 00:00:00+00'],
  [7, 'Weather App', 'A modern and functional web platform built with web programming technologies. Features convenient design, clear navigation and showcases my programming skills and creativity.', '/images/projects/project-1772182031407-591097393.png', '/orai/Kodo-virtuozai-2026-main/orai-lietuvoje/index.html', 'https://github.com/NojusTautavicius1/Kodo-virtuozai-2026', null, 'Full Stack', 0, '2026-02-27 10:47:11+00'],
];

const contentSections = [
  [1, 'hero_main', 'Nojus Tautavicius', 'Building digital experiences that merge creativity with thoughtful engineering', null, '{"subtitle": "Creative Developer", "initials": "NT"}', '2026-01-23 10:24:19+00', '2026-01-23 10:24:19+00'],
  [2, 'about_me', 'About Me', 'I create polished, production-ready digital products with a focus on clarity, reliability, and craft. My background spans design and engineering, which helps me bridge the gap between visual quality and technical excellence.', '/images/content/content-1769167652445-723238997.png', '{}', '2026-01-23 10:24:19+00', '2026-01-23 11:27:32+00'],
  [3, 'selected_work', 'Selected Work', 'A selection of projects demonstrating practical, production-ready solutions.', null, null, '2026-01-23 10:24:19+00', '2026-01-23 10:24:19+00'],
  [4, 'skills_section', 'Skills & Expertise', 'Technologies and tools used to craft reliable products', null, null, '2026-01-23 10:24:19+00', '2026-01-23 10:24:19+00'],
  [5, 'skills_frontend', 'Frontend Development', '', null, '{"skills":["React","TypeScript","Next.js","Tailwind CSS","Motion"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:33+00'],
  [6, 'skills_backend', 'Backend Development', '', null, '{"skills":["Node.js","Python","SQL","MongoDB"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:07+00'],
  [7, 'skills_mobile', 'Mobile Development', '', null, '{"skills":["React Native","Flutter"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:48+00'],
  [8, 'skills_design', 'Design', '', null, '{"skills":["Figma","UI/UX","Prototyping","Design Systems"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:18+00'],
  [9, 'skills_devops', 'Cloud & DevOps', '', null, '{"skills":["Docker","CI/CD","Vercel"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:27+00'],
  [10, 'skills_other', 'Other Skills', '', null, '{"skills":["Git","Agile","Testing","Performance","Accessibility"]}', '2026-01-23 10:24:19+00', '2026-01-23 11:11:55+00'],
  [11, 'experience', 'Experience', '', null, '{"timeline": [{"year": "2024 - 2026", "role": "Learning JavaScript", "company": "KTMC", "description": "Studying modern JavaScript frameworks and full-stack development"}]}', '2026-01-23 10:24:19+00', '2026-01-23 10:24:19+00'],
  [12, 'contact_section', 'Get In Touch', 'Have a project in mind or want to collaborate? Feel free to reach out.', null, null, '2026-01-23 10:24:19+00', '2026-01-23 10:24:19+00'],
];

const featureBoxes = [
  [1, 'about_features', 'Clean Code', 'Code2', 'Writing maintainable and scalable code', 0],
  [2, 'about_features', 'Design', 'Palette', 'Creating beautiful user experiences', 1],
  [3, 'about_features', 'Performance', 'Zap', 'Optimizing for speed and efficiency', 2],
  [4, 'projects_features', 'Full Stack', 'Layers', 'End-to-end application development', 0],
  [5, 'projects_features', 'Modern Stack', 'Rocket', 'Using latest technologies and frameworks', 1],
  [6, 'projects_features', 'Responsive', 'Smartphone', 'Works perfectly on all devices', 2],
  [7, 'skills_features', 'Frontend Expert', 'Code', 'React, TypeScript, Next.js', 0],
  [8, 'skills_features', 'Backend Pro', 'Database', 'Node.js, Python, SQL', 1],
  [9, 'skills_features', 'DevOps', 'Cloud', 'Docker, AWS, CI/CD', 2],
  [10, 'experience_features', '2024 - 2026', 'Clock', 'Learning JavaScript at KTMC', 0],
  [11, 'experience_features', 'Full Stack', 'Layers', 'Modern web development', 1],
  [12, 'experience_features', 'Student Projects', 'Briefcase', 'Building real applications', 2],
];

const services = [
  [1, 'Starter Website', 'Rocket', '$300', '3-5 days', 'Simple landing page or one-page site.', '["Responsive design", "Contact form", "Basic SEO"]', '2', 0, 1, 1, 'from-blue-500 to-cyan-500', 'border-blue-500/30', 'bg-blue-500/10', 'text-blue-400'],
  [2, 'Business Website', 'Briefcase', '$700', '7-10 days', 'Multi-page business website with CMS-ready structure.', '["Up to 8 pages", "Admin-ready content", "Performance optimization"]', '3', 1, 1, 2, 'from-emerald-500 to-teal-500', 'border-emerald-500/30', 'bg-emerald-500/10', 'text-emerald-400'],
  [3, 'Custom Web App', 'Code2', '$1500+', '2-4 weeks', 'Tailored web app with backend API and dashboard.', '["Auth", "API integration", "Admin panel"]', '5', 0, 1, 3, 'from-violet-500 to-fuchsia-500', 'border-violet-500/30', 'bg-violet-500/10', 'text-violet-400'],
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('TRUNCATE TABLE activity_log, contact_messages, feature_boxes, content_sections, services, projects, users RESTART IDENTITY CASCADE');

    for (const row of users) {
      await client.query(
        `INSERT INTO users (id, email, nickname, password, role, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        row
      );
    }

    for (const row of projects) {
      await client.query(
        `INSERT INTO projects (id, title, description, image, demo_url, github_url, tags, category, sort_order, publish_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        row
      );
    }

    for (const row of contentSections) {
      await client.query(
        `INSERT INTO content_sections (id, section, title, content, image, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)`,
        row
      );
    }

    for (const row of featureBoxes) {
      await client.query(
        `INSERT INTO feature_boxes (id, section, label, icon, description, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        row
      );
    }

    for (const row of services) {
      await client.query(
        `INSERT INTO services (id, name, icon, price, delivery_time, description, features, revisions, is_popular, is_active, sort_order, color, border_color, bg_color, icon_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        row
      );
    }

    await client.query("INSERT INTO activity_log (user_id, user_email, action, description, ip_address) VALUES (5, 'nojustautavicius007@gmail.com', 'LOGIN', 'User logged in successfully', '127.0.0.1')");

    await client.query('COMMIT');
    console.log('Supabase seed completed successfully.');
    console.log('Admin login: admin@example.com / slaptazodis');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Supabase seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
