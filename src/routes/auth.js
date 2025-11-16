const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');

// Verify an ID token sent from the client (recommended flow).
// Client signs in with Firebase client SDK, sends idToken to server.
router.post('/verify-token', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken is required' });
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return res.json({ ok: true, uid: decoded.uid, decoded });
  } catch (err) {
    return res.status(401).json({ ok: false, error: err.message });
  }
});

// Create a new user (server-side). Requires admin privileges.
router.post('/create-user', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    return res.json({ ok: true, user: userRecord });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get user record by uid
router.get('/user/:uid', async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.uid);
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(404).json({ ok: false, error: err.message });
  }
});

module.exports = router;
