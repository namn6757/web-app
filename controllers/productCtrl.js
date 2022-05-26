const { query } = require("express");
const Products = require("../models/productModel");

//filter, sorting and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString= req.query
    console.log({ before: queryObj }); //before  delete page
    const excludedFields = ["page", "sort ", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log({ after: queryObj }); //after delete page

    let queryStr = JSON.stringify(queryObj);
    console.log({ queryObj, queryStr });
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    console.log({ queryObj, queryStr });
    this.query.find(JSON.parse(queryStr));
    //gte : greatter than equal
    //gt : greatter than
    //lt : lesser than
    //lte : lesser than equal
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .paginating()
        .sorting();
      const products = await features.query;
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProducts: async (req, res) => {
    try {
      const {
        product_id,
        tittle,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "no img upload" });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "this product already exist" });

      const newProduct = new Products({
        product_id,
        tittle: tittle.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      await newProduct.save();
      res.json({ msg: "created product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json("deleted product");
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const { tittle, price, description, content, images, category } =
        req.body;
      if (!images) return res.status(400).json({ msg: "no image upload" });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          tittle: tittle.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json("updated product");
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCtrl;
