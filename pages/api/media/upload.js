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

async function uploadMedia(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    filter: ({ name, originalFilename, mimetype }) => {
      return mimetype && mimetype.startsWith('image/');
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Media upload error:', err);
      return res.status(500).json({ error: 'Failed to upload media file' });
    }

    const fileKey = Object.keys(files)[0];
    const file = files[fileKey];

    if (!file) {
      return res.status(400).json({ error: 'No image file was uploaded' });
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const originalName = uploadedFile.originalFilename;
    const fileName = uploadedFile.newFilename;
    const mimeType = uploadedFile.mimetype;
    const size = uploadedFile.size;
    const filePath = `/uploads/${fileName}`;

    try {
      const stmt = db.prepare(`
        INSERT INTO media (filename, original_name, mime_type, size, path)
        VALUES (?, ?, ?, ?, ?)
      `);
      const info = stmt.run(fileName, originalName, mimeType, size, filePath);

      return res.status(200).json({
        success: true,
        media: {
          id: info.lastInsertRowid,
          filename: fileName,
          original_name: originalName,
          mime_type: mimeType,
          size,
          path: filePath
        }
      });
    } catch (dbErr) {
      console.error('Media DB insert failed:', dbErr);
      return res.status(500).json({ error: 'Failed to record media entry in database' });
    }
  });
}

export default withAuth(uploadMedia);
