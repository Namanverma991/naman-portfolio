import formidable from 'formidable';
  import path from 'path';
  import fs from 'fs';
  import db from '../../../db';
  import { withAuth } from '../../../lib/auth';

  export const config = {
    api: {
      bodyParser: false,
    },
  };

  async function getActiveResume(req, res) {
    try {
      const active = db.prepare('SELECT * FROM resume_files WHERE is_active = 1 ORDER BY uploaded_at DESC LIMIT 1').get();
      if (!active) {
        return res.status(200).json({
          path: '/naman.pdf',
          original_name: 'naman.pdf',
          uploaded_at: new Date().toISOString()
        });
      }
      return res.status(200).json(active);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve active resume' });
    }
  }

  async function uploadResume(req, res) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      filter: ({ name, originalFilename, mimetype }) => {
        return mimetype === 'application/pdf';
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Resume upload parsing error:', err);
        return res.status(500).json({ error: 'Failed to process file upload' });
      }

      const fileKey = Object.keys(files)[0];
      const file = files[fileKey];

      if (!file) {
        return res.status(400).json({ error: 'No PDF file was uploaded' });
      }

      const uploadedFile = Array.isArray(file) ? file[0] : file;
      const originalName = uploadedFile.originalFilename;
      const fileName = uploadedFile.newFilename;
      const filePath = `/uploads/${fileName}`;

      try {
        db.prepare('UPDATE resume_files SET is_active = 0').run();

        db.prepare(`
          INSERT INTO resume_files (filename, original_name, path, is_active)
          VALUES (?, ?, ?, 1)
        `).run(fileName, originalName, filePath);

        const destPath = path.join(process.cwd(), 'public', 'naman.pdf');
        fs.copyFileSync(uploadedFile.filepath, destPath);

        return res.status(200).json({
          success: true,
          message: 'Resume uploaded and activated successfully',
          path: filePath
        });
      } catch (dbErr) {
        console.error('Resume database insert failed:', dbErr);
        return res.status(500).json({ error: 'Failed to update database records' });
      }
    });
  }

  export default async function handler(req, res) {
    if (req.method === 'GET') {
      return getActiveResume(req, res);
    } else if (req.method === 'POST') {
      return withAuth(uploadResume)(req, res);
    } else {
      return res.setHeader('Allow', ['GET', 'POST']).status(405).json({ error: 'Method Not Allowed' });
    }
  }
