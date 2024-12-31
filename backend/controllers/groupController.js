const { Group, User, Task } = require('../models');

exports.getAllGroups = async (req, res) => {
    try {
        const [groups, users] = await Promise.all([
            Group.findAll({
                include: [{
                    model: User,
                    as: 'members',
                    attributes: ['id', 'name']
                }],
                order: [['created_at', 'ASC']]
            }),
            User.findAll({
                attributes: ['id', 'name'],
                where: {
                    role: 'member'
                },
                order: [['name', 'ASC']]
            })
        ]);

        res.render('dashboard/groups/index', {
            title: 'Gestion des Groupes',
            currentPage: 'dashboard',
            currentSection: 'groups',
            groups,
            users
        });
    } catch (error) {
        console.error('Erreur groupes:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement des groupes' 
        });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { name, description, memberIds } = req.body;
        const group = await Group.create({ name, description });
        
        if (memberIds && memberIds.length > 0) {
            await group.addMembers(memberIds);
        }

        req.flash('success', 'Groupe créé avec succès');
        res.redirect('/dashboard/groups');
    } catch (error) {
        console.error('Erreur création groupe:', error);
        req.flash('error', 'Erreur lors de la création du groupe');
        res.redirect('/dashboard/groups');
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['id', 'name']
            }]
        });

        if (!group) {
            req.flash('error', 'Groupe non trouvé');
            return res.redirect('/dashboard/groups');
        }

        const users = await User.findAll({
            attributes: ['id', 'name'],
            where: { role: 'member' },
            order: [['name', 'ASC']]
        });

        res.render('dashboard/groups/edit', {
            title: 'Modifier le Groupe',
            currentPage: 'dashboard',
            currentSection: 'groups',
            group,
            users
        });
    } catch (error) {
        console.error('Erreur groupe:', error);
        req.flash('error', 'Erreur lors du chargement du groupe');
        res.redirect('/dashboard/groups');
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { name, description, memberIds } = req.body;
        const group = await Group.findByPk(req.params.id);

        if (!group) {
            req.flash('error', 'Groupe non trouvé');
            return res.redirect('/dashboard/groups');
        }

        await group.update({ name, description });
        await group.setMembers(memberIds || []);

        req.flash('success', 'Groupe mis à jour avec succès');
        res.redirect('/dashboard/groups');
    } catch (error) {
        console.error('Erreur mise à jour groupe:', error);
        req.flash('error', 'Erreur lors de la mise à jour du groupe');
        res.redirect('/dashboard/groups');
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id);
        
        if (!group) {
            req.flash('error', 'Groupe non trouvé');
            return res.redirect('/dashboard/groups');
        }

        await group.destroy();
        req.flash('success', 'Groupe supprimé avec succès');
        res.redirect('/dashboard/groups');
    } catch (error) {
        console.error('Erreur suppression groupe:', error);
        req.flash('error', 'Erreur lors de la suppression du groupe');
        res.redirect('/dashboard/groups');
    }
};

exports.getGroupTasks = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'members',
                attributes: ['id', 'name']
            }, {
                model: Task,
                as: 'tasks',
                include: [{
                    model: User,
                    as: 'assignedUser',
                    attributes: ['id', 'name']
                }]
            }]
        });

        if (!group) {
            req.flash('error', 'Groupe non trouvé');
            return res.redirect('/dashboard/groups');
        }

        res.render('dashboard/groups/tasks', {
            title: 'Tâches du Groupe',
            currentPage: 'dashboard',
            currentSection: 'groups',
            group,
            tasks: group.tasks || []
        });
    } catch (error) {
        console.error('Erreur tâches du groupe:', error);
        req.flash('error', 'Erreur lors du chargement des tâches du groupe');
        res.redirect('/dashboard/groups');
    }
};
