
import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "tsewang@example.com",
    fullName: "Tsewang",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/e.jpg",
  },
  {
    email: "tsedon@example.com",
    fullName: "Tenzin Tsedon",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/c.jpg",
  },
  {
    email: "tseyang@example.com",
    fullName: "Tenzin Tseyang",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/b.jpg",
  },
  {
    email: "sharpa@example.com",
    fullName: "Tenzinla Sharpa",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/f.jpg",
  },
  {
    email: "dorjeefnu@example.com",
    fullName: "Namgyal Dorjee Fnu",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/j.jpg",
  },
  {
    email: "lhazom@example.com",
    fullName: "Lhazom lama",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/g.jpg",
  },
  {
    email: "kalden@example.com",
    fullName: "Kalden",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/k.jpg",
  },
  {
    email: "sherap@example.com",
    fullName: "Sherap Dorjee",
    password: "123456",
    profilePicture: "http://localhost:5001/public/images/i.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();