const admin = require('firebase-admin');

// Initialize the admin SDK once. Use Application Default Credentials
// (set GOOGLE_APPLICATION_CREDENTIALS) or the environment provided by Firebase.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (err) {
    // fallback to default init (useful in emulators)
    admin.initializeApp();
  }
}

module.exports = admin;
