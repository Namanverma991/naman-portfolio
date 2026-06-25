import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getEducation(req, res) {
  try {
    const education = db.prepare('SELECT * FROM education ORDER BY position_order ASC').all();
    return res.status(200).json(education);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve education records' });
  }
}

async function createEducation(req, res) {
  try {
    const { institution, degree, gpa, period, position_order } = req.body;
    if (!institution || !degree || !period) {
      return res.status(400).json({ error: 'Institution, degree, and period are required' });
    }

    const info = db.prepare(`
      INSERT INTO education (institution, degree, gpa, period, position_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(institution, degree, gpa || '', period, position_order || 0);

    return res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create education error:', error);
    return res.status(500).json({ error: 'Failed to create education record' });
  }
}

async function updateEducation(req, res) {
  try {
    const { id, institution, degree, gpa, period, position_order } = req.body;
    if (!id || !institution || !degree || !period) {
      return res.status(400).json({ error: 'ID, institution, degree, and period are required' });
    }

    db.prepare(`
      UPDATE education
      SET institution = ?, degree = ?, gpa = ?, period = ?, position_order = ?
      WHERE id = ?
    `).run(institution, degree, gpa || '', period, position_order || 0, id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update education error:', error);
    return res.status(500).json({ error: 'Failed to update education record' });
  }
}

async function deleteEducation(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    db.prepare('DELETE FROM education WHERE id = ?').run(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete education error:', error);
    return res.status(500).json({ error: 'Failed to delete education record' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getEducation(req, res);
  } else if (req.method === 'POST') {
    return withAuth(createEducation)(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateEducation)(req, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteEducation)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }
}
