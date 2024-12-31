const { Group } = require('../models');

// Vérifie si l'utilisateur est membre du groupe ou admin
const isGroupMemberOrAdmin = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next();
        }

        const groupId = req.params.groupId || req.body.groupId;
        const group = await Group.findByPk(groupId, {
            include: [{
                model: User,
                as: 'members',
                where: { id: req.user.id },
                required: false
            }]
        });

        if (!group || !group.members.length) {
            return res.status(403).json({ 
                message: 'Accès non autorisé à ce groupe' 
            });
        }

        next();
    } catch (error) {
        console.error('Erreur permission groupe:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la vérification des permissions' 
        });
    }
};

module.exports = {
    isGroupMemberOrAdmin
}; 