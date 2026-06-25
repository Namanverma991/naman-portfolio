import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Total & Unique Visitors
    const overview = db.prepare(`
      SELECT 
        COUNT(id) as total,
        COUNT(DISTINCT ip_hash) as unique_visitors
      FROM analytics_events
      WHERE event_type = 'page_view'
    `).get();

    // 2. Daily Visitor Trends (Last 30 days)
    const daily = db.prepare(`
      SELECT 
        strftime('%Y-%m-%d', timestamp) as date,
        COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
        AND timestamp >= datetime('now', '-30 days')
      GROUP BY date
      ORDER BY date ASC
    `).all();

    // 3. Devices breakdown
    const devices = db.prepare(`
      SELECT 
        device,
        COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY device
      ORDER BY count DESC
    `).all();

    // 4. Referrers breakdown
    const referrers = db.prepare(`
      SELECT 
        referrer,
        COUNT(id) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `).all();

    return res.status(200).json({
      totalVisitors: overview.total || 0,
      uniqueVisitors: overview.unique_visitors || 0,
      dailyData: daily,
      deviceData: devices,
      referrers
    });
  } catch (error) {
    console.error('Failed to query visitor analytics:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
}

export default withAuth(handler);
