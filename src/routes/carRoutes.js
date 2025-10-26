const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken } = require("../utils/auth");

// GET /cars - liste toutes les voitures
router.get("/cars", authenticateToken, async (req, res) => {
  try {
    const cars = await prisma.car.findMany({ include: { owner: true } });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /newcars - ajoute une voiture pour le user connecté
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

module.exports = router;
