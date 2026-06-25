import db from '../../db';
import { withAuth } from '../../lib/auth';
import { logAction } from '../../lib/auditLog';

async function getSettings(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve settings' });
  }
}

async function updateSettings(req, res) {
  try {
    const data = req.body;
    const insertStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    
    const transaction = db.transaction((settingsObj) => {
      for (const [key, val] of Object.entries(settingsObj)) {
        insertStmt.run(key, val !== null && val !== undefined ? String(val) : '');
      }
    });

    transaction(data);
    
    logAction(req.admin?.id, 'UPDATE_SETTINGS', 'settings', null, data);

    return res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getSettings(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateSettings)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'PUT']).status(405).json({ error: 'Method Not Allowed' });
  }
}
