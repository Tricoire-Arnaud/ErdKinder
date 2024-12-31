const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// Liste des tâches
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'assignedTo',
                attributes: ['name']
            }]
        });

        const users = await User.findAll({
            attributes: ['id', 'name']
        });

        res.render('dashboard/tasks/index', {
            title: 'Gestion des tâches',
            currentPage: 'dashboard',
            currentSection: 'tasks',
            tasks,
            users,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// Création d'une tâche
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedToId } = req.body;
        await Task.create({
            title,
            description,
            dueDate,
            priority,
            assignedToId,
            createdById: req.user.id
        });
        res.redirect('/dashboard/tasks');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router; 