const mongoose = require("mongoose");

const endPointSchema = new mongoose.Schema({
  endpoint: {
    type: string,
    require: true,
    unique: true,
  },
  role: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("endpoints", endPointSchema);
