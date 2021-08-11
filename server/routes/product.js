const express = require("express");
const router = express.Router();

// middlewares

const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  listAll,
  remove,
  read,
  update,
  listProducts,
  totalProductsCount,
  updateStar,
  listRelated
} = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create);
router.post("/products", listProducts);
// using post request to fetch new arrival products not get as with post requests it is easy to send data in the post body , eg for sorting parameters

router.get("/products/total", totalProductsCount);

router.get("/products/:count", listAll); // TODO: implement paginate later
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

// star rating endpoint
router.put("/product/star/:productId", authCheck, updateStar);

// related products fetch
router.get("/product/related/:productId", listRelated)

module.exports = router;
