import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getStats(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM stats').all();
    const stats = {};
    rows.forEach(row => {
      stats[row.key] = row.value;
    });
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}

async function updateStats(req, res) {
  try {
    const data = req.body;
    const insertStmt = db.prepare('INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)');
    
    const transaction = db.transaction((statsObj) => {
      for (const [key, val] of Object.entries(statsObj)) {
        insertStmt.run(key, val !== null && val !== undefined ? String(val) : '');
      }
    });

    transaction(data);
    return res.status(200).json({ success: true, message: 'Stats updated successfully' });
  } catch (error) {
    console.error('Update stats error:', error);
    return res.status(500).json({ error: 'Failed to update stats' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getStats(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateStats)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'PUT']).status(405).json({ error: 'Method Not Allowed' });
  }
}
