const express = require("express");
const Article = require("../models/Article");
const Task = require("../models/Task");

const router = express.Router();

// Route pour la page d'accueil
router.get("/", (req, res) => {
  res.locals.currentPage = "home";
  res.render("index");
});

// Route pour les actualités
router.get("/actualites", (req, res) => {
  res.locals.currentPage = "actualites";
  res.render("actualites");
});

// Route pour les tâches
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.render("tasks", {
      title: "Tâches",
      currentPage: "tasks",
      tasks: tasks,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.render("tasks", {
      title: "Tâches",
      currentPage: "tasks",
      tasks: [],
    });
  }
});

module.exports = router;
