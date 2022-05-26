const User = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const useCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "the email already exits" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "the password is at least 6 characters long" });
      //password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });
      // save mongo
      await newUser.save();

      //then create jsonweb token to auth
      const accesstoken = createAccesstoken({ id: newUser._id });
      const reFreshtoken = createRefreshtoken({ id: newUser._id });
      res.cookie("reFreshtoken", reFreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
      });

      res.json({ accesstoken });
      //   res.json({ msg: "Register success" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "user does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "incorrect password" });

      //if login success, create accesstoken and refreshtoken
      const accesstoken = createAccesstoken({ id: user._id });
      const reFreshtoken = createRefreshtoken({ id: user._id });
      res.cookie("reFreshtoken", reFreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
      });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("reFreshToken", { path: "/user/refresh_token" });
      return res.json({ msg: "logged out" });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  reFreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.reFreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "pls login or register" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "pls login or register" });
        const accesstoken = createAccesstoken({ id: user.id });
        res.json({ accesstoken });
      });
      res.json({ rf_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "user does not exist" });

      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: "added to cart" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
const createAccesstoken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshtoken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = useCtrl;
