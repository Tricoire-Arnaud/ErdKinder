require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const User = require('../models/User');

// Créer une nouvelle instance de Sequelize
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

async function createAdmin() {
    try {
        await sequelize.sync();

        const adminData = {
            name: 'Admin',
            email: 'admin@maisondesenfants.fr',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin'
        };

        const existingAdmin = await User.findOne({ where: { email: adminData.email } });
        
        if (existingAdmin) {
            console.log('Un administrateur existe déjà avec cet email.');
            return;
        }

        await User.create(adminData);
        console.log('Administrateur créé avec succès!');
        console.log('Email:', adminData.email);
        console.log('Mot de passe: admin123');

    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
    } finally {
        process.exit(0);
    }
}

createAdmin(); 