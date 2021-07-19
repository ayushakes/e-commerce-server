const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;
  const user = await User.findOneAndUpdate(
    { email: email }, // finding user on the basis of email with first argument object
    { name: email.split("@")[0], picture: picture }, // second argument is what we want to update
    { new: true } // third argument is optional , it returns newly updated not the old object
  );

  if (user) { 
    console.log("USER UPDATED", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();

    res.json(newUser);
  }
};

exports.currentUser= async (req,res)=>{
  User.findOne({email:req.user.email}).exec((err,user)=>{
  if (err) throw new Error(err);
  res.json(user); 

  })
}
