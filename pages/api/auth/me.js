import { withAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).json({ error: 'Method Not Allowed' });
  }

  // withAuth will reject requests without valid token
  // If it succeeds, req.admin contains the user's decoded payload
  return res.status(200).json({
    authenticated: true,
    user: req.admin
  });
}

export default withAuth(handler);
