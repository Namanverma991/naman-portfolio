import db from '../../../db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    // 1. Save to SQLite
    db.prepare(`
      INSERT INTO contact_submissions (name, email, subject, message, is_read)
      VALUES (?, ?, ?, ?, 0)
    `).run(name, email, subject || '', message);

    // 2. Try to forward to Netlify Forms in production to utilize spam filtering
    const host = req.headers.host || '';
    const referer = req.headers.referer || '';
    
    // Only forward if not local environment
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || referer.includes('localhost') || referer.includes('127.0.0.1');

    if (!isLocal) {
      try {
        const netlifyTarget = referer || `https://${host}/`;
        const formData = new URLSearchParams();
        formData.append('form-name', 'contact');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject || '');
        formData.append('message', message);

        await fetch(netlifyTarget, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
      } catch (netlifyErr) {
        console.warn('Netlify form forwarding error:', netlifyErr.message);
      }
    }

    return res.status(200).json({ success: true, message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: 'Failed to submit message' });
  }
}
