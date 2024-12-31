require('dotenv').config();
const { Sequelize } = require('sequelize');
const User = require('../models/User');

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

async function checkAdmin() {
    try {
        const admin = await User.findOne({
            where: { email: 'admin@maisondesenfants.fr' }
        });

        if (admin) {
            console.log('Administrateur trouvé:');
            console.log('ID:', admin.id);
            console.log('Nom:', admin.name);
            console.log('Email:', admin.email);
            console.log('Rôle:', admin.role);
        } else {
            console.log('Aucun administrateur trouvé');
        }
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        process.exit(0);
    }
}

checkAdmin(); 