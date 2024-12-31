const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const groupController = require("../controllers/groupController");

// Routes des groupes
router.get("/", isAuthenticated, groupController.getAllGroups);
router.post("/", isAdmin, groupController.createGroup);
router.get("/:id", isAuthenticated, groupController.getGroupById);
router.put("/:id", isAdmin, groupController.updateGroup);
router.delete("/:id", isAdmin, groupController.deleteGroup);
router.get("/:id/tasks", isAuthenticated, groupController.getGroupTasks);

module.exports = router;
