const admin = require("../config/firebaseAdmin");
const db = admin.firestore();

module.exports = {
  async create(uid, data) {
    const ref = db.collection("users").doc(uid).collection("diary").doc();
    await ref.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return ref.id;
  },

  async list(uid) {
    const snapshot = await db.collection("users")
      .doc(uid)
      .collection("diary")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async get(uid, id) {
    const doc = await db.collection("users").doc(uid).collection("diary").doc(id).get();
    return { id: doc.id, ...doc.data() };
  },

  async update(uid, id, data) {
    return db.collection("users").doc(uid).collection("diary").doc(id)
      .update({ ...data, updatedAt: new Date() });
  },

  async remove(uid, id) {
    return db.collection("users").doc(uid).collection("diary").doc(id).delete();
  }
};
