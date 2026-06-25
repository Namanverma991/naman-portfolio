import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getExperience(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM experience ORDER BY position_order ASC').all();
    const experience = rows.map(row => ({
      ...row,
      bullets: row.bullets ? JSON.parse(row.bullets) : []
    }));
    return res.status(200).json(experience);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve experience entries' });
  }
}

async function createExperience(req, res) {
  try {
    const { title, company, type, period, bullets, position_order } = req.body;
    if (!title || !company || !period) {
      return res.status(400).json({ error: 'Title, company, and period are required' });
    }

    const info = db.prepare(`
      INSERT INTO experience (title, company, type, period, bullets, position_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      title,
      company,
      type || '',
      period,
      bullets ? JSON.stringify(bullets) : JSON.stringify([]),
      position_order || 0
    );

    return res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create experience error:', error);
    return res.status(500).json({ error: 'Failed to create experience entry' });
  }
}

async function updateExperience(req, res) {
  try {
    const { id, title, company, type, period, bullets, position_order } = req.body;
    if (!id || !title || !company || !period) {
      return res.status(400).json({ error: 'ID, title, company, and period are required' });
    }

    db.prepare(`
      UPDATE experience
      SET title = ?, company = ?, type = ?, period = ?, bullets = ?, position_order = ?
      WHERE id = ?
    `).run(
      title,
      company,
      type || '',
      period,
      bullets ? JSON.stringify(bullets) : JSON.stringify([]),
      position_order || 0,
      id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update experience error:', error);
    return res.status(500).json({ error: 'Failed to update experience entry' });
  }
}

async function deleteExperience(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    db.prepare('DELETE FROM experience WHERE id = ?').run(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return res.status(500).json({ error: 'Failed to delete experience entry' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getExperience(req, res);
  } else if (req.method === 'POST') {
    return withAuth(createExperience)(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateExperience)(req, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteExperience)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }
}
