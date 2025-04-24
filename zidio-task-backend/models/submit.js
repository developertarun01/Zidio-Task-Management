const mongoose = require("mongoose");
const SubmitSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
});

module.exports = mongoose.model("Submit", SubmitSchema);
