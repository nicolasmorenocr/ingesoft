const express = require("express");
const router = express.Router();
const { verifyAuth } = require("./auth"); 
const diaryController = require("../controllers/diaryController");

router.post("/", verifyAuth, diaryController.createEntry);
router.get("/", verifyAuth, diaryController.getEntries);
router.get("/:id", verifyAuth, diaryController.getEntryById);
router.put("/:id", verifyAuth, diaryController.updateEntry);
router.delete("/:id", verifyAuth, diaryController.deleteEntry);

module.exports = router;
