import pool from '../db/mysql.js';

const updateProjectUrls = async () => {
  try {
    console.log('Atnaujinami projektų URL...');

    // Skaičiuotuvas
    await pool.query(
      `UPDATE projects SET demo_url = ?, github_url = ? WHERE id = ?`,
      ['/projektas/skaiciuotuvas/index.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/skaiciuotuvas', 1]
    );
    console.log('✓ Skaičiuotuvas atnaujintas');

    // Kalendorius
    await pool.query(
      `UPDATE projects SET demo_url = ?, github_url = ? WHERE id = ?`,
      ['/projektas/kalendorius/kalendorius.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/kalendorius', 2]
    );
    console.log('✓ Kalendorius atnaujintas');

    // Express CRUD Sistema
    await pool.query(
      `UPDATE projects SET demo_url = NULL, github_url = ? WHERE id = ?`,
      ['https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/express_crud_adresai', 3]
    );
    console.log('✓ Express CRUD atnaujintas');

    // React Learning App
    await pool.query(
      `UPDATE projects SET demo_url = NULL, github_url = ? WHERE id = ?`,
      ['https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/reactas', 4]
    );
    console.log('✓ React App atnaujintas');

    // Teksto Apdorojimas
    await pool.query(
      `UPDATE projects SET demo_url = ?, github_url = ? WHERE id = ?`,
      ['/projektas/Tekstoapdorojimas/index.html', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/Tekstoapdorojimas', 5]
    );
    console.log('✓ Teksto Apdorojimas atnaujintas');

    // Portfolio CMS
    await pool.query(
      `UPDATE projects SET demo_url = ?, github_url = ? WHERE id = ?`,
      ['http://localhost:5173', 'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/projektas', 6]
    );
    console.log('✓ Portfolio CMS atnaujintas');

    // Orai (Weather Project)
    await pool.query(
      `UPDATE projects SET demo_url = ?, github_url = ? WHERE id = ?`,
      ['/orai/Kodo-virtuozai-2026-main/orai-lietuvoje/index.html', 'https://github.com/NojusTautavicius1/Kodo-virtuozai-2026', 7]
    );
    console.log('✓ Orai projektas atnaujintas');

    // Patikrinti rezultatus
    const [projects] = await pool.query('SELECT id, title, demo_url, github_url FROM projects ORDER BY sort_order');
    console.log('\n=== Atnaujinti projektai ===');
    projects.forEach(p => {
      console.log(`\n${p.id}. ${p.title}`);
      console.log(`   Demo: ${p.demo_url || 'Nėra'}`);
      console.log(`   GitHub: ${p.github_url || 'Nėra'}`);
    });

    console.log('\n✓ Visi projektai sėkmingai atnaujinti!');
    process.exit(0);
  } catch (error) {
    console.error('Klaida atnaujinant projektus:', error);
    process.exit(1);
  }
};

updateProjectUrls();
