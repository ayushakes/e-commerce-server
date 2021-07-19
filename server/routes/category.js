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
  getSubCategories
} = require("../controllers/category"); 

// routes
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);  // not applying middlewares here as this will be public 
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subcategories/:_id", getSubCategories)

module.exports = router;
