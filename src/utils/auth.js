const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // à mettre dans ton .env

module.exports = {
  // Hash du mot de passe
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  // Vérification du mot de passe
  comparePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  },

  // Création du token JWT
  generateToken: (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
  },

  // Middleware pour vérifier le token JWT
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token invalide" });
      req.user = user;
      next();
    });
  },
};
