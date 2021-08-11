const SubCategory = require("../models/subCategory");
const product = require("../models/product");
const slugify = require("slugify");
const { response } = require("express");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await new SubCategory({
      name: name,
      parent: parent,
      slug: slugify(name),
    }).save();
    res.json(subCategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("sub Category create failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await SubCategory.find({}) // empty object to search all
        .sort({ createdAt: -1 })
        .exec() // latest created categories
    );
  } catch (err) {
    console.log(err);
    res.json("error occured at server while fetching sub Category");
  }
};

exports.read = async (req, res) => {
  try {
    let subCategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).exec(); // we mentioned in our url which had /:slug
    res.json(subCategory);
  } catch (err) {
    res.json("error occured while fetching sub Category ");
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name), parent: parent },
      { new: true } // if we dont use new:true , the response will be old data not the updated one
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("sub Category update fails ");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    response.status(400).send("delete sub Category failed at server");
  }
};

exports.getSubCategoryProducts = async (req, res) => {
  try {
    const subCategory = await SubCategory.find({ slug: req.params.slug });
    const products = await product
      .find({ subCategories: subCategory }) // directly finding category matching instead of comparing ids
      .populate("category")
      .exec();

    res.json({ subCategory, products });
  } catch (err) {
    console.log("error while loading category products ");
  }
};
