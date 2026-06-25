export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ error: 'Method Not Allowed' });
  }

  // Clear session cookie
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${secureFlag}`
  );

  return res.status(200).json({ success: true, message: 'Successfully logged out' });
}
