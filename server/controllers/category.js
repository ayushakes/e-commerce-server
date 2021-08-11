const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

const slugify = require("slugify");
const { response } = require("express");
const product = require("../models/product");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name: name,
      slug: slugify(name),
    }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await Category.find({}) // empty object to search all
        .sort({ createdAt: -1 })
        .exec() // latest created categories
    );
  } catch (err) {
    console.log(err);
    res.json("error occured at server while fetching categories");
  }
};

exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec(); // we mentioned in our url which had /:slug
    res.json(category);
  } catch (err) {
    res.json("error occured while fetching category ");
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name) },
      { new: true } // if we dont use new:true , the response will be old data not the updated one
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("category update fails ");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    response.status(400).send("delete category failed at server");
  }
};

exports.getSubCategories = (req, res) => {
  // npt making it async deliberately
  SubCategory.find({ parent: req.params._id }).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const category = await Category.find({ slug: req.params.slug });
    const products = await product
      .find({ category: category }) // directly finding category matching instead of comparing ids
      .populate("category")
      .populate("postedBy", "_id name") // passing the properties we need
      .exec();

    res.json({ category, products });
  } catch (err) {
    console.log("error while loading category products ");
  }
};
