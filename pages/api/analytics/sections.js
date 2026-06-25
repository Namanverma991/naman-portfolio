import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const sections = db.prepare(`
      SELECT 
        page,
        COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY page
      ORDER BY count DESC
    `).all();

    return res.status(200).json(sections);
  } catch (error) {
    console.error('Failed to query section views:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
}

export default withAuth(handler);
