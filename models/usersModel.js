const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

// let userSchema = new mongoose.Schema({
//   first_name: String,
//   last_name: String,
//   username: String,
//   id_card: String,
//   phone: String,
//   birth_date: Date,
//   email: String,
//   password: String,
//   card_number: String,
//   card_number: String,
//   card_validity: String,
//   cvc: Number,
//   country: String,
//   city: String,
//   street: String,
//   num_house: String,
//   date_created: {
//     type: Date,
//     default: Date.now(),
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
// });

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date_created: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    default: "user",
  },
});

exports.createToken = (_id, role) => {
  let token = jwt.sign({ _id, role }, config.tokenSecret, {
    expiresIn: "60mins",
  });
  return token;
};

exports.UserModel = mongoose.model("users", userSchema);
