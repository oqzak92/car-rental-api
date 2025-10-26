const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.rental.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { email: "alice@example.com", password: "password123" },
    { email: "bob@example.com", password: "password123" },
    { email: "carol@example.com", password: "password123" },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    users.push(user);
  }

  const carsData = [
    { brand: "Toyota", model: "Corolla", year: 2018, ownerId: users[0].id },
    { brand: "Honda", model: "Civic", year: 2020, ownerId: users[1].id },
    { brand: "Ford", model: "Focus", year: 2017, ownerId: users[0].id },
    { brand: "BMW", model: "320i", year: 2019, ownerId: users[2].id },
    { brand: "Audi", model: "A3", year: 2021, ownerId: users[1].id },
  ];

  const cars = [];
  for (const c of carsData) {
    const car = await prisma.car.create({ data: c });
    cars.push(car);
  }

  // Locations (rentals) — quelques exemples liant users et cars
  const rentalsData = [
    { carId: cars[0].id, userId: users[1].id },
    { carId: cars[1].id, userId: users[2].id },
    { carId: cars[3].id, userId: users[0].id },
  ];

  for (const r of rentalsData) {
    await prisma.rental.create({ data: r });
  }

  console.log("Seed terminée :", {
    users: users.length,
    cars: cars.length,
    rentals: rentalsData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
