require('dotenv').config();
const { sequelize, Group, User, Task } = require('../models');
const bcrypt = require('bcrypt');

async function seedGroups() {
    try {
        // Créer quelques utilisateurs de test
        const users = await User.bulkCreate([
            {
                name: 'Test User 1',
                email: 'user1@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'member'
            },
            {
                name: 'Test User 2',
                email: 'user2@test.com',
                password: await bcrypt.hash('password123', 10),
                role: 'member'
            }
        ], {
            fields: ['name', 'email', 'password', 'role']
        });

        // Créer quelques groupes
        const groups = await Group.bulkCreate([
            {
                name: 'Groupe Jardinage',
                description: 'Groupe responsable du jardin pédagogique'
            },
            {
                name: 'Groupe Communication',
                description: 'Gestion de la communication et des événements'
            },
            {
                name: 'Groupe Maintenance',
                description: 'Entretien des locaux et du matériel'
            }
        ], {
            fields: ['name', 'description']
        });

        // Associer les utilisateurs aux groupes
        await Promise.all([
            groups[0].addMembers([users[0], users[1]]),
            groups[1].addMembers([users[0]]),
            groups[2].addMembers([users[1]])
        ]);

        // Créer des tâches pour chaque groupe
        const tasks = await Task.bulkCreate([
            {
                title: 'Planter les tomates',
                description: 'Préparer les semis de tomates pour le printemps',
                status: 'todo',
                priority: 'high',
                groupId: groups[0].id,
                assignedToId: users[0].id,
                createdById: users[0].id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Dans 7 jours
            },
            {
                title: 'Préparer la newsletter',
                description: 'Rédiger la newsletter mensuelle',
                status: 'in_progress',
                priority: 'medium',
                groupId: groups[1].id,
                assignedToId: users[0].id,
                createdById: users[0].id,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Dans 3 jours
            },
            {
                title: 'Réparer la clôture',
                description: 'Réparer la clôture du jardin',
                status: 'todo',
                priority: 'low',
                groupId: groups[2].id,
                assignedToId: users[1].id,
                createdById: users[1].id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Dans 14 jours
            }
        ]);

        console.log('Données de test créées avec succès !');
        console.log('Groupes créés:', groups.length);
        console.log('Utilisateurs créés:', users.length);
        console.log('Tâches créées:', tasks.length);

    } catch (error) {
        console.error('Erreur lors de la création des données de test:', error);
    } finally {
        await sequelize.close();
    }
}

// Exécuter le script
seedGroups(); 