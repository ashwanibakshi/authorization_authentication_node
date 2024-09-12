const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model("roles", roleSchema);
