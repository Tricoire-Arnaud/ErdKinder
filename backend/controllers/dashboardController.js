const { Article, User, Task, Group } = require('../models');

exports.getDashboardOverview = async (req, res) => {
    try {
        const stats = {
            articlesCount: await Article.count(),
            tasksCount: await Task.count(),
            usersCount: await User.count()
        };

        const recentArticles = await Article.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }]
        });

        const recentTasks = await Task.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'assignedUser',
                attributes: ['id', 'name']
            }]
        });

        res.render('dashboard/index', {
            title: 'Dashboard',
            currentPage: 'dashboard',
            currentSection: 'overview',
            stats,
            recentArticles,
            recentTasks
        });
    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.status(500).render('error', {
            message: 'Erreur lors du chargement du dashboard'
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [
                {
                    model: Task,
                    as: 'assignedTasks',
                    include: [{
                        model: Group,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: Group,
                    as: 'groups',
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return res.status(404).render('404', {
                message: 'Utilisateur non trouvé'
            });
        }

        res.render('dashboard/profile', {
            title: `Profil - ${user.name}`,
            currentPage: 'dashboard',
            currentSection: 'profile',
            user
        });
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).render('error', {
            message: 'Erreur lors du chargement du profil'
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.update({ name, email });
        res.json({
            success: true,
            message: 'Profil mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil'
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        res.render('dashboard/users', {
            title: 'Gestion des Utilisateurs',
            currentPage: 'dashboard',
            currentSection: 'users',
            users
        });
    } catch (error) {
        console.error('Erreur utilisateurs:', error);
        res.status(500).render('error', {
            message: 'Erreur lors du chargement des utilisateurs'
        });
    }
};
