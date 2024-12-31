const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { isGroupMemberOrAdmin } = require("../middleware/groupPermissions");
const taskController = require("../controllers/taskController");
const { Task } = require("../models");

// Routes des tâches
router.get("/global", isAuthenticated, taskController.getGlobalTasks);
router.get(
  "/group/:groupId",
  isAuthenticated,
  isGroupMemberOrAdmin,
  taskController.getGroupTasks
);
router.post("/", isAuthenticated, taskController.createTask);
router.put("/:taskId", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        const oldStatus = task.status;
        await task.update({ status: req.body.status });

        // Émettre l'événement Socket.IO
        req.app.get('io').emit('taskUpdated', {
            task: task,
            oldStatus: oldStatus,
            newStatus: req.body.status
        });

        res.json({ success: true, task });
    } catch (error) {
        console.error('Erreur mise à jour tâche:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche' });
    }
});
router.delete("/:taskId", isAdmin, taskController.deleteTask);

module.exports = router;
