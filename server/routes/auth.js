const express=require("express");
const router=express.Router();
 

// middlewares

const {authCheck, adminCheck}= require("../middlewares/auth")

// controller
const {createOrUpdateUser,currentUser}= require("../controllers/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck,adminCheck, currentUser);  // admin check for admin requests 


module.exports=router;  