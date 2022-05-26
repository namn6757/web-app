const User = require("../models/userModel");
const authAdmin = async (req, res, next) => {
  try {
    //get user infomation by id
    const user = await User.findOne({
      _id: req.user.id,
    });
    if (user.role === 0)
      return res.status(400).json({ msg: "Adimn resources access denied" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};
module.exports = authAdmin;
