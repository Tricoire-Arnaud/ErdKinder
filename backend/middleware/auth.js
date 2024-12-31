const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error', { 
        message: 'Accès non autorisé' 
    });
};

module.exports = {
    isAuthenticated,
    isAdmin
};
