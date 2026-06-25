import db from '../../../db';
import { withAuth } from '../../../lib/auth';

async function getProjects(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY position_order ASC').all();
    const projects = rows.map(row => ({
      ...row,
      technologies: row.technologies ? JSON.parse(row.technologies) : [],
      featured: !!row.featured
    }));
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}

async function createProject(req, res) {
  try {
    const { title, subtitle, description, technologies, link, image_path, featured, position_order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const info = db.prepare(`
      INSERT INTO projects (title, subtitle, description, technologies, link, image_path, featured, position_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      subtitle || '',
      description || '',
      technologies ? JSON.stringify(technologies) : JSON.stringify([]),
      link || '',
      image_path || '',
      featured ? 1 : 0,
      position_order || 0
    );

    return res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
}

async function updateProject(req, res) {
  try {
    const { id, title, subtitle, description, technologies, link, image_path, featured, position_order } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'ID and Title are required' });
    }

    db.prepare(`
      UPDATE projects
      SET title = ?, subtitle = ?, description = ?, technologies = ?, link = ?, image_path = ?, featured = ?, position_order = ?
      WHERE id = ?
    `).run(
      title,
      subtitle || '',
      description || '',
      technologies ? JSON.stringify(technologies) : JSON.stringify([]),
      link || '',
      image_path || '',
      featured ? 1 : 0,
      position_order || 0,
      id
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getProjects(req, res);
  } else if (req.method === 'POST') {
    return withAuth(createProject)(req, res);
  } else if (req.method === 'PUT') {
    return withAuth(updateProject)(req, res);
  } else if (req.method === 'DELETE') {
    return withAuth(deleteProject)(req, res);
  } else {
    return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).json({ error: 'Method Not Allowed' });
  }
}
