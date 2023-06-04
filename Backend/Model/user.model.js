const mongoose = require("mongoose");

const userSchma = mongoose.Schema({
  first: { type: String, require: true },
  last:{type: String, require: true},
  email:{type: String, require: true},
  phoneNo:{type:Number,require:true},
  dob:{type: String, require: true},
  address:String,
  city:{type: String, require: true},
  state:{type: String, require: true},
  pincode:{type: String, require: true}
},{versionKey:false});

const UserModel = mongoose.model("user", userSchma);

module.exports = {
  UserModel,
};
