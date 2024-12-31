const viewVariables = (req, res, next) => {
    // Variables globales pour toutes les vues
    res.locals.currentPage = '';
    res.locals.currentSection = '';
    res.locals.user = req.user || null;
    
    // Vérifier si req.flash existe avant de l'utiliser
    if (typeof req.flash === 'function') {
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
    } else {
        res.locals.error = [];
        res.locals.success = [];
    }
    
    next();
};

module.exports = viewVariables; 