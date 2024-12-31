require('dotenv').config();
const { Article, User } = require('../models');

async function checkArticles() {
    try {
        const articles = await Article.findAll({
            include: [{
                model: User,
                as: 'author',
                attributes: ['name', 'email']
            }]
        });

        console.log('Nombre d\'articles:', articles.length);
        articles.forEach(article => {
            console.log('-------------------');
            console.log('Titre:', article.title);
            console.log('Auteur:', article.author ? article.author.name : 'Inconnu');
            console.log('Publié:', article.published);
            console.log('Date de création:', article.createdAt);
        });
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        process.exit();
    }
}

checkArticles(); 