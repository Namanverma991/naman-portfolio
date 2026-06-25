import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getCertifications(req, res) {
  try {
    const certs = db.prepare('SELECT * FROM certifications ORDER BY position_order ASC').all();
    return res.status(200).json(certs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve certifications' });
  }
}

async function createCertification(req, res) {
  try {
    const { title, issuer, date, position_order } = req.body;
    if (!title || !issuer || !date) {
      return res.status(400).json({ error: 'Title, issuer, and date are required' });
    }

    const info = db.prepare(`
      INSERT INTO certifications (title, issuer, date, position_order)
      VALUES (?, ?, ?, ?)
    `).run(title, issuer, date, position_order || 0);

    return res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create certification error:', error);
    return res.status(500).json({ error: 'Failed to create certification' });
  }
}

async function updateCertification(req, res) {
  try {
    const { id, title, issuer, date, position_order } = req.body;
    if (!id || !title || !issuer || !date) {
      return res.status(400).json({ error: 'ID, title, issuer, and date are required' });
    }

    db.prepare(`
      UPDATE certifications
      SET title = ?, issuer = ?, date = ?, position_order = ?
      WHERE id = ?
    `).run(title, issuer, date, position_order || 0, id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update certification error:', error);
    return res.status(500).json({ error: 'Failed to update certification' });
  }
}

async function deleteCertification(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete certification error:', error);
    return res.status(500).json({ error: 'Failed to delete certification' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getCertifications(req, res);
  } else if (req.method === 'POST') {
    return withAuth(createCertification)(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateCertification)(req, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteCertification)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }
}
