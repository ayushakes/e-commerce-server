const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bordyParser = require("body-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const fs = require("fs");
require("dotenv").config();
  

// app
const app = express();

// db
mongoose
  .connect(
    process.env.DATABASE, // to access env variables like this dotenv package is required
    {
      useNewUrlParser: true, // search mongoose config options on google and see the docs for their use
      useCreateIndex: true,
      useFindAndModify: true,
    }
  )
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log(`DB connections error ${err}`));

// middleWares to our express app constant
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" })); // setting limit also
app.use(cors());

// routes middleware
 
fs.readdirSync("./routes").map((route) =>    // automatically importing the routes 
  app.use("/api", require("./routes/" + route))
);

// routes for api endponts
// making routes and controllers in different files
// app.get('/api' ,(req,res)=>{

//    res.json({

//     data:"this is the response we get on reaching out to the mentioned url changed sdsdsd  "
//    })

// })

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on the  ${port}`);
});
