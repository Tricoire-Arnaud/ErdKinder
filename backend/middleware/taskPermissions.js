const { Task, Group } = require('../models');

const canManageTask = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next();
        }

        const taskId = req.params.taskId;
        const task = await Task.findByPk(taskId, {
            include: [{
                model: Group,
                as: 'group',
                include: [{
                    model: User,
                    as: 'members',
                    where: { id: req.user.id },
                    required: false
                }]
            }]
        });

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        if (!task.group || !task.group.members.length) {
            return res.status(403).json({ 
                message: 'Vous n\'avez pas les permissions pour gérer cette tâche' 
            });
        }

        next();
    } catch (error) {
        console.error('Erreur permission tâche:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la vérification des permissions' 
        });
    }
};

module.exports = {
    canManageTask
}; 