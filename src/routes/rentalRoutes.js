const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken } = require("../utils/auth");

// GET /rentals - Liste toutes les locations du user connecté
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

// GET /rentals/:id - Récupère une location spécifique
router.get("/rentals/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: { car: true, user: true },
    });
    if (!rental) {
      return res.status(404).json({ error: "Location non trouvée" });
    }
    if (rental.userId !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    res.json(rental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /rentals - Crée une nouvelle location
router.post("/rentals", authenticateToken, async (req, res) => {
  try {
    const { carId } = req.body;
    if (!carId) {
      return res.status(400).json({ error: "carId requis" });
    }

    // Vérifier que la voiture existe
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return res.status(404).json({ error: "Voiture introuvable" });
    }

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

// PUT /rentals/:id - Met à jour une location
router.put("/rentals/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { carId } = req.body;

    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      return res.status(404).json({ error: "Location non trouvée" });
    }
    if (rental.userId !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    // Si carId est fourni, vérifier que la voiture existe
    if (carId) {
      const car = await prisma.car.findUnique({ where: { id: carId } });
      if (!car) {
        return res.status(404).json({ error: "Voiture introuvable" });
      }
    }

    const updated = await prisma.rental.update({
      where: { id },
      data: { carId },
      include: { car: true, user: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /rentals/:id - Supprime une location
router.delete("/rentals/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rental = await prisma.rental.findUnique({ where: { id } });

    if (!rental) {
      return res.status(404).json({ error: "Location non trouvée" });
    }
    if (rental.userId !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    await prisma.rental.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error("Erreur détaillée :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;
