const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken } = require("../utils/auth");

// GET /cars - Liste toutes les voitures
router.get("/cars", authenticateToken, async (req, res) => {
  try {
    const cars = await prisma.car.findMany({ include: { owner: true } });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /cars/:id - Récupère une voiture spécifique
router.get("/cars/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const car = await prisma.car.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!car) {
      return res.status(404).json({ error: "Voiture non trouvée" });
    }
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /newcars - Ajoute une voiture
router.post("/newcars", authenticateToken, async (req, res) => {
  try {
    const { brand, model, year } = req.body;
    if (!brand || !model || !year) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year,
        ownerId: req.user.id,
      },
    });
    res.status(201).json(car);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /cars/:id - Supprime une voiture (et ses locations)
router.delete("/cars/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) return res.status(404).json({ error: "Voiture non trouvée" });
    if (car.ownerId !== req.user.id)
      return res.status(403).json({ error: "Accès refusé" });
    // Supprimer d'abord les locations liées
    await prisma.rental.deleteMany({ where: { carId: id } });
    // Puis supprimer la voiture
    await prisma.car.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error("Erreur détaillée :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// PUT /cars/:id - Met à jour une voiture
router.put("/cars/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { brand, model, year } = req.body;
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) return res.status(404).json({ error: "Voiture non trouvée" });
    if (car.ownerId !== req.user.id)
      return res.status(403).json({ error: "Accès refusé" });
    const updated = await prisma.car.update({
      where: { id },
      data: { brand, model, year },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
