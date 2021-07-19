const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: { type: String, unique: true, lowecase: true, index: true },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subCategories: {
      type: [
        {
          type: ObjectId,
          ref: "SubCategory", // used to save id only and populate the whole value by ref to the model 
        },
      ],
    },
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    // color: {
    //   type: String,
    //   enum: ["Black", "Brown", "Slver", "white", "Blue"],
    // },
    // brand: {
    //   type: String,
    //   enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
    // },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
