const { Article, User } = require('../models');

exports.getHomePage = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { published: true },
            limit: 3,
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }]
        });

        res.render('index', { 
            title: 'Accueil',
            currentPage: 'home',
            articles
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        res.status(500).render('error', {
            message: 'Une erreur est survenue lors du chargement de la page d\'accueil'
        });
    }
};
