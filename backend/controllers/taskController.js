const { Task, User, Group } = require('../models');

exports.getGlobalTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['id', 'name']
                },
                {
                    model: Group,
                    as: 'group',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'createdByUser',
                    attributes: ['id', 'name']
                }
            ],
            order: [['updated_at', 'DESC']]
        });

        res.render('dashboard/tasks/global', {
            title: 'Vue globale des tâches',
            currentPage: 'dashboard',
            currentSection: 'tasks',
            tasks
        });
    } catch (error) {
        console.error('Erreur tâches globales:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement des tâches' 
        });
    }
};

exports.getGroupTasks = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.groupId, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['id', 'name']
            }]
        });

        if (!group) {
            return res.status(404).render('404', {
                message: 'Groupe non trouvé'
            });
        }

        const tasks = await Task.findAll({
            where: { group_id: req.params.groupId },
            include: [
                {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'createdByUser',
                    attributes: ['id', 'name']
                }
            ],
            order: [['updated_at', 'DESC']]
        });

        res.render('dashboard/tasks/group', {
            title: `Tâches - ${group.name}`,
            currentPage: 'dashboard',
            currentSection: 'tasks',
            group,
            tasks
        });
    } catch (error) {
        console.error('Erreur tâches groupe:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement des tâches' 
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedToId, groupId } = req.body;

        const task = await Task.create({
            title,
            description,
            status: 'todo',
            priority: priority || 'medium',
            due_date: dueDate || null,
            assigned_to_id: assignedToId || null,
            created_by_id: req.user.id,
            group_id: groupId
        });

        res.json({
            success: true,
            message: 'Tâche créée avec succès',
            task
        });
    } catch (error) {
        console.error('Erreur création tâche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la tâche',
            error: error.message
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        const oldStatus = task.status;
        await task.update({ status: req.body.status });

        // Émettre un événement via Socket.IO pour la mise à jour en temps réel
        req.app.get('io').emit('taskUpdated', {
            task: task,
            oldStatus: oldStatus,
            newStatus: req.body.status
        });

        res.json({ success: true, task });
    } catch (error) {
        console.error('Erreur mise à jour tâche:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour de la tâche' 
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        await task.destroy();
        res.json({
            success: true,
            message: 'Tâche supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression tâche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la tâche',
            error: error.message
        });
    }
};
