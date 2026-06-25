import db from '../../../db';
import { withAuth } from '../../../lib/auth';
import fs from 'fs';
import path from 'path';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.setHeader('Allow', ['DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  try {
    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(id);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', media.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete row in DB
    db.prepare('DELETE FROM media WHERE id = ?').run(id);

    return res.status(200).json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({ error: 'Failed to delete media' });
  }
}

export default withAuth(handler);
