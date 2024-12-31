const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Liste des articles
router.get('/', auth, async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'author',
                attributes: ['name']
            }]
        });

        res.render('dashboard/articles/index', {
            title: 'Gestion des articles',
            currentPage: 'dashboard',
            currentSection: 'articles',
            articles,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// Formulaire de création d'article
router.get('/new', auth, (req, res) => {
    res.render('dashboard/articles/new', {
        title: 'Nouvel article',
        currentPage: 'dashboard',
        currentSection: 'articles',
        user: req.user
    });
});

// Création d'un article
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, content, excerpt } = req.body;
        const article = await Article.create({
            title,
            content,
            excerpt,
            image: req.file ? `/uploads/articles/${req.file.filename}` : null,
            authorId: req.user.id
        });
        res.redirect('/dashboard/articles');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router; 