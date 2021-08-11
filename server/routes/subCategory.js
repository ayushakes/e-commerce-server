const express = require("express");
const router = express.Router();

// middlewares

const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  read,
  update,
  remove,
  list,
  getSubCategoryProducts,
} = require("../controllers/subCategory");

// routes
router.post("/subCategory", authCheck, adminCheck, create);
router.get("/subCategories", list); // not applying middlewares here as this will be public
router.get("/subCategory/:slug", read);
router.put("/subCategory/:slug", authCheck, adminCheck, update);
router.delete("/subCategory/:slug", authCheck, adminCheck, remove);

router.get("/subCategory/products/:slug", getSubCategoryProducts);

module.exports = router;
