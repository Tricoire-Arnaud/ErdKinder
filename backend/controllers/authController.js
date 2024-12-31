const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Connexion',
        currentPage: 'login',
        error: req.flash('error')
    });
};

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', {
        title: 'Inscription',
        currentPage: 'register'
    });
};

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation des mots de passe
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Inscription',
                currentPage: 'register',
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        // Vérification de l'existence de l'utilisateur
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Inscription',
                currentPage: 'register',
                error: 'Cet email est déjà utilisé'
            });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        req.flash('success', 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.render('auth/register', {
            title: 'Inscription',
            currentPage: 'register',
            error: 'Une erreur est survenue lors de l\'inscription'
        });
    }
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
