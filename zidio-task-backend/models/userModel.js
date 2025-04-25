const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["admin", "employee", "manager"], //Differentiate the role for every individual, and delfault to employee.
    default: "employee",
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  location: { type: String, default: "" },
  birthday: { type: Date },
  bio: { type: String, default: "" },
  avatar: {
    type: String,
    default: "", // or some default URL
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId; // if not using Google
    },
  },

  createdAt: { type: Date, default: Date.now },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Password comparison helper
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
