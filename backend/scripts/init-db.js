require('dotenv').config();
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function initDatabase() {
    try {
        // Synchroniser les modèles
        await sequelize.sync({ force: true });

        // Créer l'administrateur par défaut
        const adminPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin',
            email: 'admin@maisondesenfants.fr',
            password: adminPassword,
            isAdmin: true
        });

        console.log('Base de données initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    } finally {
        process.exit(0);
    }
}

initDatabase(); 