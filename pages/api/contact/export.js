import db from '../../../db';
import { withAuth } from '../../../lib/auth';
import { stringify } from 'csv-stringify/sync';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rows = db.prepare('SELECT id, name, email, subject, message, is_read, created_at FROM contact_submissions ORDER BY created_at DESC').all();

    const csvData = stringify(rows, {
      header: true,
      columns: ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at']
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contact_messages.csv');
    return res.status(200).send(csvData);
  } catch (error) {
    console.error('CSV export error:', error);
    return res.status(500).json({ error: 'Failed to export messages to CSV' });
  }
}

export default withAuth(handler);
