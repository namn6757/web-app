const Payments = require("../models/paymentModel");
const Products = require("../models/productModel");
const Users = require("../models/userModel");

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createPayments: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "user does not exist" });

      const { cart, paymentID, address } = req.body;
      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        address,
        cart,
        paymentID,
      });

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.json({ msg: "payment successs" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
const sold = async (id, quantity, oldSold) => {
  await Products.findByIdAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

module.exports = paymentCtrl;
