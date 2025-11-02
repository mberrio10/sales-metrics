const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    agent: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    profit: { type: Number, required: true, min: 0 },
    jobNumber: { type: Number, required: true, unique: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    lead: { type: String, trim: true },
  },
  {
    collection: "dummy_data",
  }
);

// Helpful indexes
DataSchema.index({ agent: 1 });
DataSchema.index({ status: 1 });
DataSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Data", DataSchema);
