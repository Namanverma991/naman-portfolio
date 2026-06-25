import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getSkills(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM skills ORDER BY position_order ASC').all();
    const skills = {};
    rows.forEach(row => {
      skills[row.category] = row.items ? JSON.parse(row.items) : [];
    });
    return res.status(200).json(skills);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve skills' });
  }
}

async function updateSkills(req, res) {
  try {
    const data = req.body; // Expects format: { languages: [...], libraries: [...] }
    const insertStmt = db.prepare('INSERT OR REPLACE INTO skills (category, items, position_order) VALUES (?, ?, ?)');
    
    const transaction = db.transaction((categories) => {
      let order = 0;
      for (const [cat, items] of Object.entries(categories)) {
        insertStmt.run(cat, JSON.stringify(items), order++);
      }
    });

    transaction(data);
    return res.status(200).json({ success: true, message: 'Skills updated successfully' });
  } catch (error) {
    console.error('Update skills error:', error);
    return res.status(500).json({ error: 'Failed to update skills' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getSkills(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateSkills)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'PUT']).status(405).json({ error: 'Method Not Allowed' });
  }
}
