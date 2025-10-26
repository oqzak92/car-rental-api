const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

app.use(express.json());

app.get("/", (req, res) => res.send("🚗 API en route !"));

// Routes auth
app.use("/auth", authRoutes);

// Routes voitures
app.use("/", carRoutes); 

// Routes rental
app.use("/", rentalRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
