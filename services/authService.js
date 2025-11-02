const bcrypt = require("bcryptjs");
const hardcodedUser = require("../config/hardcodedUser");
const User = require("../models/User");
const { mode } = require("../config/authMode");

async function validateUser(username, password) {
  if (mode === "hardcoded") {
    return (
      username === hardcodedUser.username && password === hardcodedUser.password
    );
  }

  if (mode === "database") {
    const user = await User.findOne({ username });
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  return false;
}

module.exports = { validateUser };
