import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getServices(req, res) {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY position_order ASC').all();
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve services' });
  }
}

async function createService(req, res) {
  try {
    const { icon, title, description, position_order } = req.body;
    if (!icon || !title || !description) {
      return res.status(400).json({ error: 'Icon, title, and description are required' });
    }

    const info = db.prepare(`
      INSERT INTO services (icon, title, description, position_order)
      VALUES (?, ?, ?, ?)
    `).run(icon, title, description, position_order || 0);

    return res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ error: 'Failed to create service' });
  }
}

async function updateService(req, res) {
  try {
    const { id, icon, title, description, position_order } = req.body;
    if (!id || !icon || !title || !description) {
      return res.status(400).json({ error: 'ID, icon, title, and description are required' });
    }

    db.prepare(`
      UPDATE services
      SET icon = ?, title = ?, description = ?, position_order = ?
      WHERE id = ?
    `).run(icon, title, description, position_order || 0, id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ error: 'Failed to update service' });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ error: 'Failed to delete service' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getServices(req, res);
  } else if (req.method === 'POST') {
    return withAuth(createService)(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateService)(req, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteService)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }
}
