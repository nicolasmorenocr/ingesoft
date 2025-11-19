const DiaryService = require("../services/DiaryService");

module.exports = {
  async createEntry(req, res) {
    const uid = req.user.uid;
    const data = req.body;
    const id = await DiaryService.create(uid, data);
    res.status(201).send({ id });
  },

  async getEntries(req, res) {
    const uid = req.user.uid;
    const entries = await DiaryService.list(uid);
    res.send(entries);
  },

  async getEntryById(req, res) {
    const uid = req.user.uid;
    const id = req.params.id;
    const entry = await DiaryService.get(uid, id);
    res.send(entry);
  },

  async updateEntry(req, res) {
    const uid = req.user.uid;
    const id = req.params.id;
    await DiaryService.update(uid, id, req.body);
    res.send({ ok: true });
  },

  async deleteEntry(req, res) {
    const uid = req.user.uid;
    const id = req.params.id;
    await DiaryService.remove(uid, id);
    res.send({ ok: true });
  }
};
