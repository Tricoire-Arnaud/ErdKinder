require('dotenv').config();
const mysql = require('mysql2/promise');

async function cleanDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        const tables = [
            'articles',
            'tasks',
            'group_users',
            '`groups`',
            'users',
            'SequelizeMeta'
        ];

        for (const table of tables) {
            try {
                await connection.execute(`DROP TABLE IF EXISTS ${table}`);
                console.log(`Table ${table} supprimée avec succès`);
            } catch (error) {
                console.error(`Erreur lors de la suppression de la table ${table}:`, error);
            }
        }

        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Nettoyage de la base de données terminé');
    } catch (error) {
        console.error('Erreur lors du nettoyage de la base de données:', error);
    } finally {
        await connection.end();
    }
}

cleanDatabase(); 