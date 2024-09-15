const mongoose = require("mongoose");

const endPointSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  role: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("endpoints", endPointSchema);
