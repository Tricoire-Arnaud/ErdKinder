const express = require('express');
const router = express.Router();
const articlesRouter = require('./articles');
const tasksRouter = require('./tasks');
const auth = require('../../middleware/auth');

// Routes principales du dashboard
router.use('/articles', articlesRouter);
router.use('/tasks', tasksRouter);

// Page d'accueil du dashboard (déjà créée)
router.get('/', auth, async (req, res) => {
    // ... code existant ...
});

module.exports = router; 