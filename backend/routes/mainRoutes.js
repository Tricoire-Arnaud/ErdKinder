const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const progressController = require('../controllers/progressController');

// Route principale
router.get('/', homeController.getHomePage);

// Route pour la page d'avancement
router.get('/avancement', progressController.getProgressPage);

module.exports = router;
