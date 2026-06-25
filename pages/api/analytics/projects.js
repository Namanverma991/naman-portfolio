import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Retrieve views, total clicks, GitHub clicks and demo clicks for each project from JSON metadata
    const projectStats = db.prepare(`
      SELECT 
        json_extract(metadata, '$.title') as project_title,
        SUM(CASE WHEN event_type = 'project_view' THEN 1 ELSE 0 END) as views,
        SUM(CASE WHEN event_type = 'project_click' THEN 1 ELSE 0 END) as clicks,
        SUM(CASE WHEN event_type = 'project_click' AND json_extract(metadata, '$.target') = 'github' THEN 1 ELSE 0 END) as github_clicks,
        SUM(CASE WHEN event_type = 'project_click' AND json_extract(metadata, '$.target') = 'demo' THEN 1 ELSE 0 END) as demo_clicks
      FROM analytics_events
      WHERE event_type IN ('project_view', 'project_click')
        AND metadata IS NOT NULL
      GROUP BY project_title
      ORDER BY views DESC
    `).all();

    return res.status(200).json(projectStats);
  } catch (error) {
    console.error('Failed to query project analytics:', error);
    return res.status(500).json({ error: 'Database query failed' });
  }
}

export default withAuth(handler);
