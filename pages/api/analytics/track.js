import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';
import db from '../../../db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { event_type, page, metadata } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: 'event_type is required' });
    }

    // IP hashing for privacy compliance
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    const userAgentStr = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentStr);
    const ua = parser.getResult();

    const device = ua.device.type || 'desktop';
    const browser = ua.browser.name || 'unknown';
    const os = ua.os.name || 'unknown';
    const referrer = req.headers['referer'] || '';

    db.prepare(`
      INSERT INTO analytics_events (event_type, page, metadata, ip_hash, user_agent, device, browser, os, referrer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      event_type,
      page || '',
      metadata ? JSON.stringify(metadata) : null,
      ipHash,
      userAgentStr,
      device,
      browser,
      os,
      referrer
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tracking API error:', error);
    return res.status(500).json({ error: 'Failed to record tracking event' });
  }
}
