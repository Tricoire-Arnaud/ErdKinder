const { Article, User } = require('../models');
const upload = require('../config/multer');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            order: [['created_at', 'DESC']], 
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email']
            }],
            raw: false,
            nest: true
        });

        console.log('Articles avec auteurs:', JSON.stringify(articles, null, 2));

        res.render('dashboard/articles/index', {
            title: 'Gestion des articles',
            currentPage: 'dashboard',
            currentSection: 'articles',
            articles,
            tinymceApiKey: process.env.TINYMCE_API_KEY,
            formatDate: (date) => {
                return new Date(date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        });
    } catch (error) {
        console.error('Erreur articles:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement des articles' 
        });
    }
};

exports.getNewArticleForm = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email']
        });

        res.render('dashboard/articles/edit', {
            title: 'Nouvel Article',
            currentPage: 'dashboard',
            currentSection: 'articles',
            article: null,
            users,
            currentUser: req.user,
            tinymceApiKey: process.env.TINYMCE_API_KEY
        });
    } catch (error) {
        console.error('Erreur chargement formulaire:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement du formulaire' 
        });
    }
};

exports.getEditArticleForm = async (req, res) => {
    try {
        const [article, users] = await Promise.all([
            Article.findByPk(req.params.id, {
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }]
            }),
            User.findAll({
                attributes: ['id', 'name', 'email']
            })
        ]);

        if (!article) {
            return res.status(404).render('404');
        }

        res.render('dashboard/articles/edit', {
            title: 'Modifier l\'Article',
            currentPage: 'dashboard',
            currentSection: 'articles',
            article,
            users,
            currentUser: req.user,
            tinymceApiKey: process.env.TINYMCE_API_KEY
        });
    } catch (error) {
        console.error('Erreur édition article:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement de l\'article' 
        });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const { title, content, published } = req.body;
        
        // Validation des données
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Le titre et le contenu sont requis'
            });
        }

        // Utiliser l'ID de l'utilisateur connecté comme auteur
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Vous devez être connecté pour créer un article'
            });
        }

        const article = await Article.create({
            title,
            content,
            published: published || false,
            authorId: req.user.id,
            publishedAt: published ? new Date() : null
        });

        res.json({ 
            success: true, 
            message: 'Article créé avec succès',
            article 
        });
    } catch (error) {
        console.error('Erreur création article:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la création de l\'article',
            error: error.message
        });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { title, content, published, authorId } = req.body;
        
        // Validation des données
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Le titre et le contenu sont requis'
            });
        }

        const article = await Article.findByPk(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        // Si l'article n'était pas publié avant et qu'il l'est maintenant
        const publishedAt = !article.published && published ? new Date() : article.publishedAt;

        await article.update({
            title,
            content,
            published: published || false,
            authorId: authorId || article.authorId,
            publishedAt
        });

        res.json({ 
            success: true, 
            message: 'Article mis à jour avec succès',
            article 
        });
    } catch (error) {
        console.error('Erreur mise à jour article:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la mise à jour de l\'article',
            error: error.message
        });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        await article.destroy();
        res.json({ 
            success: true, 
            message: 'Article supprimé avec succès' 
        });
    } catch (error) {
        console.error('Erreur suppression article:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la suppression de l\'article' 
        });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: {
                    message: 'Aucune image n\'a été téléchargée'
                }
            });
        }

        // Retourner l'URL de l'image pour TinyMCE
        const imageUrl = `/uploads/articles/${req.file.filename}`;
        res.json({
            location: imageUrl // Format requis par TinyMCE
        });
    } catch (error) {
        console.error('Erreur upload image:', error);
        res.status(500).json({
            error: {
                message: 'Erreur lors de l\'upload de l\'image'
            }
        });
    }
};
