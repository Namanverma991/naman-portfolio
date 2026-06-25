import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    
    const countRow = db.prepare('SELECT COUNT(id) as count FROM contact_submissions').get();
    const total = countRow ? countRow.count : 0;

    const items = db.prepare(`
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT ?
    `).all(limit);

    return res.status(200).json({
      total,
      items
    });
  } catch (error) {
    console.error('List contact submissions error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contact submissions' });
  }
}

export default withAuth(handler);
