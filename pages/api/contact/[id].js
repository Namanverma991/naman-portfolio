import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { is_read } = req.body;
      db.prepare('UPDATE contact_submissions SET is_read = ? WHERE id = ?').run(is_read ? 1 : 0, id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update contact status error:', error);
      return res.status(500).json({ error: 'Failed to update message status' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete contact error:', error);
      return res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  return res.setHeader('Allow', ['PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);
