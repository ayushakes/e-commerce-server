const admin = require("../firebase/firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  // next is the callback

  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken); // mind the spellings authtoken , 't' is small even if we have passed the authToken . dont now the reason
    console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser; // this will be added to the req object avaialable to whole node application .
    // right now we want to access in the controller
    next();
  } catch (err) {
    res.status(401).json({
      // 401 means unauthorized
      err: "invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource , access denied ",
    });
  } else {
    next();
  }
};
