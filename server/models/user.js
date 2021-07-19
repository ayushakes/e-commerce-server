const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true, /// perform querrying the database efficiently using idex true
    },
    role: {
      type: String,
      default: "subscriber", // default user role value`
    },

    cart: {
      type: Array,
      default: [],
    },

    address: String,
    //   wishList: [{ type: ObjectId, ref: "Product" }], // ref means refers to "Product" model
  },
  { timestamps: true } // will autocreate the time fields
);

module.exports = mongoose.model("User", userSchema);
