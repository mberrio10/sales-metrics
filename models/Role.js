const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    agent: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, trim: true },
  },
  {
    collection: "dummy_roles",
  }
);

RoleSchema.index({ role: 1 });

module.exports = mongoose.model("Role", RoleSchema);
