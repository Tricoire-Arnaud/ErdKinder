require('dotenv').config();
const express = require('express');
const path = require('node:path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { sequelize, Article, User, syncModels } = require('./models');
const bcrypt = require('bcrypt');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const viewVariables = require('./middleware/viewVariables');
const mainRoutes = require('./routes/mainRoutes');

// Créer l'application Express
const app = express();

// Créer le serveur HTTP et Socket.IO
const server = require('node:http').createServer(app);
const io = require('socket.io')(server);

// Configuration de Passport
require('./config/passport')(passport);

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Middleware pour parser le body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Flash messages - doit être après session
app.use(flash());

// Configuration de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les variables de vue - doit être après flash
app.use(viewVariables);

// Configuration de Socket.IO
io.on('connection', (socket) => {
    console.log('Client connecté');

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});

// Rendre io accessible dans les routes
app.set('io', io);

// Helpers pour les vues
app.locals.formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

app.locals.stripHtml = (html) => {
    if (!html) return '';
    
    // Créer un élément div temporaire
    const tempDiv = new (require('jsdom').JSDOM)('').window.document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Récupérer le texte et gérer les entités HTML
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Nettoyer les espaces multiples
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
};

// Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard/groups', groupRoutes);
app.use('/dashboard/tasks', taskRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/actualites', articlesRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page non trouvée',
        currentPage: '404',
        error: 'Page non trouvée'
    });
});

// Gestion des erreurs générales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Erreur',
        currentPage: 'error',
        error: 'Une erreur est survenue'
    });
});

const PORT = process.env.PORT || 3000;

// Fonction pour initialiser la base de données
async function initializeDatabase() {
    try {
        // Synchroniser les modèles sans alter ni force
        await sequelize.sync();
        console.log('Base de données synchronisée');

        // Vérifier si un admin existe déjà
        const adminExists = await User.findOne({
            where: { email: 'admin@maisondesenfants.fr' }
        });

        if (!adminExists) {
            // Créer l'administrateur
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin',
                email: 'admin@maisondesenfants.fr',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Administrateur créé avec succès');
        }

        // Démarrer le serveur
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
}

// Initialiser la base de données au démarrage
initializeDatabase();

module.exports = app;