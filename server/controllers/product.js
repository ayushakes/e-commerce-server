const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

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

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subCategories")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true } // to send back updated response also
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("error while updating product ", err);
    return res.status(400).send("product update failed");
  }
};

// WITHOUT PAGINATION

// exports.listProducts = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subCategories")
//       .sort([[sort, order]]) // for more than one sort order we can have multiple n an array
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log("error in listing products", err);
//   }
// };

// WITH PAGINATION
exports.listProducts = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const productsPerPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * productsPerPage) // basically skipping the number of products on the basis of page number
      .populate("category")
      .populate("subCategories")
      .sort([[sort, order]]) // for more than one sort order we can have multiple n an array
      .limit(productsPerPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log("error in listing products", err);
  }
};

exports.totalProductsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.updateStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body; // 1-5
  // who is updating?
  // check if currently logged user have already  added ratings to this product ?
  let existingRatingObject = product.ratings.find(
    (el) => el.postedBy.toString() === user._id.toString()
  );

  // if user havnt left ratings yet , push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(ratingAdded);
  } else {
    // if user have already left rating , update it
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } }, // finding the ratings
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id }, // ne is for not equal in mongoose
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subCategories")

    .populate(
      "postedBy"

      // ,"-password"    if we want to exclude some field we can do this
    )
    .exec();

  res.json(related);
};
