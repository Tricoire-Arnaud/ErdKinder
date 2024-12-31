const express = require('express');
const router = express.Router();
const { Task, User, Group } = require('../models');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { isGroupMemberOrAdmin } = require('../middleware/groupPermissions');

// Vue globale des tâches (lecture seule)
router.get('/global', isAuthenticated, async (req, res) => {
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
                }
            ],
            order: [['updatedAt', 'DESC']]
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
});

// Tâches d'un groupe spécifique
router.get('/group/:groupId', isAuthenticated, isGroupMemberOrAdmin, async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.groupId, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['id', 'name']
            }]
        });

        if (!group) {
            return res.status(404).render('404');
        }

        const tasks = await Task.findAll({
            where: { groupId: req.params.groupId },
            include: [
                {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['id', 'name']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.render('dashboard/groups/tasks', {
            title: `Tâches - ${group.name}`,
            currentPage: 'dashboard',
            currentSection: 'groups',
            group,
            tasks
        });
    } catch (error) {
        console.error('Erreur tâches groupe:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement des tâches' 
        });
    }
});

// Créer une tâche dans un groupe
router.post('/group/:groupId', isAuthenticated, isGroupMemberOrAdmin, async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            status: 'todo',
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            assignedToId: req.body.assignedToId,
            createdById: req.user.id,
            groupId: req.params.groupId
        });

        res.json(task);
    } catch (error) {
        console.error('Erreur création tâche:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création de la tâche' 
        });
    }
});

// Mettre à jour une tâche
router.put('/:taskId', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId, {
            include: [{ model: Group, as: 'group' }]
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        // Vérifier les permissions
        if (req.user.role !== 'admin') {
            const group = await Group.findByPk(task.groupId, {
                include: [{
                    model: User,
                    as: 'members',
                    where: { id: req.user.id },
                    required: false
                }]
            });

            if (!group || !group.members.length) {
                return res.status(403).json({ 
                    message: 'Accès non autorisé à cette tâche' 
                });
            }
        }

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        console.error('Erreur mise à jour tâche:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour de la tâche' 
        });
    }
});

// Supprimer une tâche
router.delete('/:taskId', isAdmin, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        await task.destroy();
        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression tâche:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression de la tâche' 
        });
    }
});

module.exports = router;
