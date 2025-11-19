const admin = require('../config/firebaseAdmin');
const db = admin.firestore();

function diaryCollection(uid) {
  // Colección por usuario: users/{uid}/diary
  return db.collection('users').doc(uid).collection('diary');
}

module.exports = {
  async create(uid, data) {
    const col = diaryCollection(uid);
    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = await col.add({
      title: data.title || '',
      body: data.body || '',
      mood: data.mood || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      attachments: data.attachments || [],
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  },

  async list(uid) {
    const snapshot = await diaryCollection(uid)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async get(uid, id) {
    const doc = await diaryCollection(uid).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(uid, id, data) {
    const updateData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    return diaryCollection(uid).doc(id).update(updateData);
  },

  async remove(uid, id) {
    return diaryCollection(uid).doc(id).delete();
  },
};
