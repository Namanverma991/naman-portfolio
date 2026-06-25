import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getPersonal(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM personal_info').all();
    const personal = {};
    rows.forEach((row) => {
      personal[row.key] = row.value;
    });
    return res.status(200).json(personal);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve personal info' });
  }
}

async function updatePersonal(req, res) {
  try {
    const data = req.body;
    const insertStmt = db.prepare('INSERT OR REPLACE INTO personal_info (key, value) VALUES (?, ?)');
    
    const transaction = db.transaction((items) => {
      for (const [key, val] of Object.entries(items)) {
        insertStmt.run(key, val !== null && val !== undefined ? String(val) : '');
      }
    });

    transaction(data);
    return res.status(200).json({ success: true, message: 'Personal info updated successfully' });
  } catch (error) {
    console.error('Failed to update personal info:', error);
    return res.status(500).json({ error: 'Failed to update personal info' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getPersonal(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updatePersonal)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'PUT']).status(405).json({ error: 'Method Not Allowed' });
  }
}
