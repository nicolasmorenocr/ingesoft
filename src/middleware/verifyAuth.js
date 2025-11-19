const admin = require('../config/firebaseAdmin');

async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.*)$/);
    if (!match) {
      return res.status(401).json({ ok: false, error: 'No token provided' });
    }
    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    // adjuntamos user info para usarla en controllers
    req.user = { uid: decoded.uid, ...decoded };
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid token', details: err.message });
  }
}

module.exports = verifyAuth;
