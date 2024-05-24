const express = require("express");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  registerForEvent,
  getUserEvents,
} = require("../controllers/eventController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/", getEvents);
router.post("/", authenticateToken, createEvent);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);
router.post("/:id/register", authenticateToken, registerForEvent);
router.get("/user", authenticateToken, getUserEvents);

module.exports = router;
