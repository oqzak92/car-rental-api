const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken } = require("../utils/auth");

// GET /rentals - liste toutes les locations du user connecté
router.get("/rentals", authenticateToken, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { userId: req.user.id },
      include: { car: true, user: true },
    });
    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /rentals - créer une nouvelle location
router.post("/rentals", authenticateToken, async (req, res) => {
  try {
    const { carId } = req.body;
    if (!carId) return res.status(400).json({ error: "carId requis" });

    // Vérifier que la voiture existe
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) return res.status(404).json({ error: "Voiture introuvable" });

    const rental = await prisma.rental.create({
      data: {
        carId,
        userId: req.user.id,
      },
      include: { car: true, user: true },
    });

    res.status(201).json(rental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
