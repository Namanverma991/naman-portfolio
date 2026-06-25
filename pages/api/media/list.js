import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const media = db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all();
    return res.status(200).json(media);
  } catch (error) {
    console.error('Failed to select media:', error);
    return res.status(500).json({ error: 'Failed to retrieve media list' });
  }
}

export default withAuth(handler);
