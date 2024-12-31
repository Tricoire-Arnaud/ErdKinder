const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");
const dashboardArticleController = require("../controllers/dashboardArticleController");
const upload = require("../config/multer");

// Middleware pour vérifier l'authentification sur toutes les routes du dashboard
router.use(isAuthenticated);

// Routes du dashboard
router.get("/", dashboardController.getDashboardOverview);
router.get("/profile/:userId", dashboardController.getUserProfile);
router.put("/profile/:userId", dashboardController.updateUserProfile);
router.get("/users", isAdmin, dashboardController.getUsers);

// Routes des articles du dashboard
router.get("/articles", dashboardArticleController.getAllArticles);
router.get("/articles/new", dashboardArticleController.getNewArticleForm);
router.get("/articles/:id/edit", dashboardArticleController.getEditArticleForm);
router.post("/articles", dashboardArticleController.createArticle);
router.put("/articles/:id", dashboardArticleController.updateArticle);
router.delete("/articles/:id", dashboardArticleController.deleteArticle);

// Route pour l'upload d'images via TinyMCE
router.post("/articles/upload-image", upload.single('file'), dashboardArticleController.uploadImage);

module.exports = router;
