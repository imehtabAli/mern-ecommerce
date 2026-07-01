
const Product = require('../models/productModel');

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: req.file ? req.file.path : '',
      createdBy: req.user._id,
    });
    await product.save();
    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter).skip(skip).limit(Number(limit));
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) return res.status(404).json({ message: "Product not found." });

    if (!foundProduct.createdBy || foundProduct.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own products." });
    }

    const { name, description, price, category, stock } = req.body;
    const updateData = { name, description, price, category, stock };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) return res.status(404).json({ message: "Product not found." });

    if (!foundProduct.createdBy || foundProduct.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products." });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};