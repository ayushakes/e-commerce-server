const express=require("express");
const router=express.Router();

router.post("/demo-route",(req,res)=>{

    res.json({
        data:"hey u created a user "
    })
});

module.exports=router; 