require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false
    }
);

async function cleanDatabase() {
    try {
        // Supprimer toutes les tables
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.drop();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('Base de données nettoyée avec succès');
    } catch (error) {
        console.error('Erreur lors du nettoyage de la base de données:', error);
    } finally {
        process.exit(0);
    }
}

cleanDatabase(); 