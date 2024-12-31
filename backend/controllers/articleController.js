const { Article, User } = require('../models');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { published: true },
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }],
            order: [['created_at', 'DESC']]
        });

        res.render('actualites', {
            title: 'Actualités',
            currentPage: 'actualites',
            articles
        });
    } catch (error) {
        console.error('Erreur articles:', error);
        res.status(500).render('error', { 
            title: 'Erreur',
            message: 'Erreur lors du chargement des articles' 
        });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findOne({
            where: { 
                id: req.params.id,
                published: true
            },
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }]
        });

        if (!article) {
            return res.status(404).render('404', {
                title: 'Page non trouvée',
                message: 'Article non trouvé'
            });
        }

        res.render('article', {
            title: article.title,
            currentPage: 'actualites',
            article
        });
    } catch (error) {
        console.error('Erreur article:', error);
        res.status(500).render('error', { 
            title: 'Erreur',
            message: 'Erreur lors du chargement de l\'article' 
        });
    }
};
