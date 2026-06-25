import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, bcrypt.genSaltSync(10));
}

export function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to protect Next.js API routes
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const cookies = req.headers.cookie ? parseCookies(req.headers.cookie) : {};
      const token = cookies.admin_token;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No session token found' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
      }

      // Attach admin identity to the request
      req.admin = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Authentication check failed:', error);
      return res.status(500).json({ error: 'Internal auth middleware failure' });
    }
  };
}

// Simple cookie parser helper
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const key = parts.shift().trim();
      const val = parts.join('=').trim();
      list[key] = decodeURIComponent(val);
    }
  });
  return list;
}
