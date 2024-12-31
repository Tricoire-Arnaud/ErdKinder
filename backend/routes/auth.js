const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes d'authentification
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}));
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Inscription',
                currentPage: 'register',
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Inscription',
                currentPage: 'register',
                error: 'Cet email est déjà utilisé'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'member'
        });

        res.redirect('/auth/login');

    } catch (error) {
        console.error(error);
        res.render('auth/register', {
            title: 'Inscription',
            currentPage: 'register',
            error: 'Une erreur est survenue'
        });
    }
});
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
