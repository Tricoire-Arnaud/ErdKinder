const { up } = require('../migrations/20241221_update_articles_author');

async function runMigration() {
    try {
        await up();
        console.log('Migration terminée avec succès');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
        process.exit(1);
    }
}

runMigration();
