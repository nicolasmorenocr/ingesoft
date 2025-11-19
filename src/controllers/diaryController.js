const DiaryService = require('../services/DiaryService');

module.exports = {
  async createEntry(req, res) {
    try {
      const uid = req.user.uid;
      const data = req.body;
      const id = await DiaryService.create(uid, data);
      return res.status(201).json({ ok: true, id });
    } catch (err) {
      console.error('createEntry error', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getEntries(req, res) {
    try {
      const uid = req.user.uid;
      const entries = await DiaryService.list(uid);
      return res.json({ ok: true, entries });
    } catch (err) {
      console.error('getEntries error', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getEntryById(req, res) {
    try {
      const uid = req.user.uid;
      const id = req.params.id;
      const entry = await DiaryService.get(uid, id);
      if (!entry) return res.status(404).json({ ok: false, error: 'Not found' });
      return res.json({ ok: true, entry });
    } catch (err) {
      console.error('getEntryById error', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  },

  async updateEntry(req, res) {
    try {
      const uid = req.user.uid;
      const id = req.params.id;
      await DiaryService.update(uid, id, req.body);
      return res.json({ ok: true });
    } catch (err) {
      console.error('updateEntry error', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  },

  async deleteEntry(req, res) {
    try {
      const uid = req.user.uid;
      const id = req.params.id;
      await DiaryService.remove(uid, id);
      return res.json({ ok: true });
    } catch (err) {
      console.error('deleteEntry error', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  },
};
