const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base
  await prisma.rental.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  // Créer 3 utilisateurs
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: "carol@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  // Créer 5 voitures
  const car1 = await prisma.car.create({
    data: { brand: "Toyota", model: "Corolla", year: 2018, ownerId: alice.id },
  });

  const car2 = await prisma.car.create({
    data: { brand: "Honda", model: "Civic", year: 2020, ownerId: bob.id },
  });

  const car3 = await prisma.car.create({
    data: { brand: "Ford", model: "Focus", year: 2017, ownerId: alice.id },
  });

  const car4 = await prisma.car.create({
    data: { brand: "BMW", model: "320i", year: 2019, ownerId: carol.id },
  });

  const car5 = await prisma.car.create({
    data: { brand: "Audi", model: "A3", year: 2021, ownerId: bob.id },
  });

  // Créer 5 locations
  await prisma.rental.create({
    data: { carId: car1.id, userId: bob.id },
  });

  await prisma.rental.create({
    data: { carId: car2.id, userId: carol.id },
  });

  await prisma.rental.create({
    data: { carId: car4.id, userId: alice.id },
  });

  await prisma.rental.create({
    data: { carId: car3.id, userId: bob.id },
  });

  await prisma.rental.create({
    data: { carId: car5.id, userId: alice.id },
  });

  console.log("Seed terminée : 3 users, 5 cars, 5 rentals");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
