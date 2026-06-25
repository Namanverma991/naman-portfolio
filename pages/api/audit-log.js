import db from '../../db';
import { withAuth } from '../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const logs = db.prepare(`
      SELECT al.*, au.email as admin_email 
      FROM audit_logs al
      LEFT JOIN admin_users au ON al.admin_id = au.id
      ORDER BY al.timestamp DESC 
      LIMIT 100
    `).all();
    return res.status(200).json(logs);
  } catch (error) {
    console.error('Audit log API error:', error);
    return res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
}

export default withAuth(handler);
