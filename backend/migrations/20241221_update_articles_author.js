const { Article, User } = require('../models');

async function up() {
    try {
        // Trouver l'utilisateur admin
        const adminUser = await User.findOne({
            where: { email: 'admin@maisondesenfants.fr' }
        });

        if (!adminUser) {
            console.error('Utilisateur admin non trouvé');
            return;
        }

        // Mettre à jour tous les articles sans auteur
        await Article.update(
            { author_id: adminUser.id },
            { where: { author_id: null } }
        );

        console.log('Migration terminée avec succès');
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
        throw error;
    }
}

module.exports = { up };
