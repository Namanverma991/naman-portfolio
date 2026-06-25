import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const totalDownloads = db.prepare(`
      SELECT COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'resume_download'
    `).get()?.count || 0;

    const totalViews = db.prepare(`
      SELECT COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'resume_view'
    `).get()?.count || 0;

    const history = db.prepare(`
      SELECT 
        id,
        timestamp,
        ip_hash,
        device,
        browser,
        os
      FROM analytics_events
      WHERE event_type = 'resume_download'
      ORDER BY timestamp DESC
      LIMIT 50
    `).all();

    return res.status(200).json({
      totalDownloads,
      totalViews,
      history
    });
  } catch (error) {
    console.error('Failed to query resume analytics:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
}

export default withAuth(handler);
