require('dotenv').config();
const { sequelize } = require('../models');

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Base de données synchronisée avec succès');
    } catch (error) {
        console.error('Erreur lors de la synchronisation:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase(); 