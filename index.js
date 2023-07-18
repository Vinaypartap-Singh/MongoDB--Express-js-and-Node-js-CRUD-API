const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
mongoose.connect("mongodb://localhost:27017/Product");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const productSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  boostProduct: Boolean,
});

const Product = mongoose.model("Products", productSchema);

// Create Products
app.post("/product/add", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// Get Products

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({
    gotProducts: true,
    products,
  });
});

// Update Products

app.put("/product/update/:id", async (req, res) => {
  let products = await Product.findById(req.params.id);

  products = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    useValidator: true,
  });

  res.status(200).json({
    status: "success",
    products,
  });
});

// Delete Product

app.delete("/product/delete/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({
      status: "error",
      message: "Products Not Found",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    status: "Success",
    message: "Product Deleted Successfully",
  });
});

app.get("/", (req, res) => {
  res.send("server created");
});

app.listen(3001, () => {
  console.log("Server is Running");
});
