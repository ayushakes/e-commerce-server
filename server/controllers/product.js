const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);

    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create PRoduct failed ");
    res.json({ err: err.message });
  }
};

exports.listAll = async (req, res) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.count)) // limiting the number of products , also making sure we make the parmam count to integer
    .populate("category")
    .populate("subCategories"); // we can use this as we have set ref in the model otherwise we cannot
  //
  res.json(products);
};
