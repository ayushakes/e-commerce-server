const express = require("express");
const router = express.Router();

// middlewares

const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, listAll } = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll); // TODO: implement paginate later

module.exports = router;
