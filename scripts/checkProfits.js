const mongoose = require("mongoose");
const DummyData = require("../models/Data");
require("dotenv").config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Grab a few sample documents
    const samples = await DummyData.find({}, { profit: 1, _id: 0 }).limit(10);

    console.log("Sample profits from DB:");
    samples.forEach((doc, i) => {
      console.log(`${i + 1}. Raw: ${doc.profit}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error checking profits:", err);
    process.exit(1);
  }
}

run();
