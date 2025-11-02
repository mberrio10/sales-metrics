const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create a new user
    const user = new User({
      username: "admin",
      password: "password123", // will be hashed automatically by the pre-save hook
    });

    await user.save();
    console.log("🎉 User created:", user.username);

    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  } catch (err) {
    console.error("❌ Error seeding user:", err.message);
  }
}

seed();
