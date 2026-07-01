const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Product = require('./models/productModel');
const User = require('./models/userModel');

const products = [
  { name: "Apple iPhone 15 Pro", description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.", price: 134999, category: "Electronics", stock: 20, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400" },
  { name: "Samsung Galaxy S24 Ultra", description: "Premium Android smartphone with S Pen, 200MP camera, and AI features.", price: 129999, category: "Electronics", stock: 15, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400" },
  { name: "Sony WH-1000XM5", description: "Industry-leading noise cancelling headphones with 30-hour battery life.", price: 24999, category: "Audio", stock: 30, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400" },
  { name: "Apple MacBook Air M3", description: "Supercharged by M3 chip, ultralight design with all-day battery life.", price: 114999, category: "Laptops", stock: 10, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
  { name: "Nike Air Jordan 1 Retro", description: "Iconic basketball sneaker with premium leather upper and Air cushioning.", price: 12999, category: "Footwear", stock: 50, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { name: "Adidas Ultraboost 23", description: "Responsive running shoe with Boost midsole for ultimate energy return.", price: 9999, category: "Footwear", stock: 40, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" },
  { name: "iPad Pro 12.9 M2", description: "Most powerful iPad ever with M2 chip, Liquid Retina XDR display.", price: 99999, category: "Electronics", stock: 12, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
  { name: "Levi's 511 Slim Jeans", description: "Classic slim fit jeans in premium denim with a modern silhouette.", price: 3499, category: "Clothing", stock: 100, image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400" },
  { name: "Ray-Ban Aviator Classic", description: "Timeless aviator sunglasses with UV protection and premium glass lenses.", price: 6999, category: "Accessories", stock: 35, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
  { name: "Dyson V15 Detect", description: "Most powerful cordless vacuum with laser dust detection technology.", price: 49999, category: "Home Appliances", stock: 8, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { name: "Canon EOS R50", description: "Compact mirrorless camera with 24.2MP sensor, perfect for content creators.", price: 59999, category: "Cameras", stock: 7, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" },
  { name: "The North Face Jacket", description: "Waterproof and windproof jacket with ThermoBall insulation for extreme weather.", price: 14999, category: "Clothing", stock: 25, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
  { name: "Apple Watch Series 9", description: "Advanced health features, brighter display, and powerful S9 chip.", price: 41999, category: "Electronics", stock: 18, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400" },
  { name: "JBL Flip 6", description: "Portable waterproof Bluetooth speaker with powerful sound and 12hr battery.", price: 8999, category: "Audio", stock: 45, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
  { name: "Kindle Paperwhite", description: "Waterproof e-reader with 6.8-inch display and adjustable warm light.", price: 13999, category: "Electronics", stock: 22, image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400" },
   {
    name: "Kindle Paperwhite",
    description: "Waterproof e-reader with 6.8-inch display and adjustable warm light.",
    price: 13999,
    category: "Electronics",
    stock: 22,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400"
  },
  {
    name: "Apple AirPods Pro",
    description: "Wireless earbuds with active noise cancellation.",
    price: 21999,
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"
  },
  {
    name: "Samsung Galaxy Watch",
    description: "Smartwatch with fitness tracking and AMOLED display.",
    price: 18999,
    category: "Electronics",
    stock: 18,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"
  },
  {
    name: "Sony WH-1000XM5",
    description: "Premium wireless noise-canceling headphones.",
    price: 29999,
    category: "Electronics",
    stock: 12,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
  },
  {
    name: "Dell XPS 13",
    description: "Compact ultrabook with Intel Core i7 processor.",
    price: 99999,
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
  },
  {
    name: "Canon EOS M50",
    description: "Mirrorless camera with 24MP sensor.",
    price: 58999,
    category: "Electronics",
    stock: 10,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches.",
    price: 4999,
    category: "Electronics",
    stock: 35,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400"
  },
  {
    name: "Gaming Mouse",
    description: "Ergonomic gaming mouse with programmable buttons.",
    price: 2499,
    category: "Electronics",
    stock: 40,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400"
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker.",
    price: 3499,
    category: "Electronics",
    stock: 30,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400"
  },
  {
    name: "iPad Air",
    description: "10.9-inch tablet with M2 chip.",
    price: 59999,
    category: "Electronics",
    stock: 14,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"
  },
  {
    name: "Running Shoes",
    description: "Lightweight breathable running shoes.",
    price: 4499,
    category: "Footwear",
    stock: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
  },
  {
    name: "Leather Backpack",
    description: "Premium leather backpack for work and travel.",
    price: 5999,
    category: "Fashion",
    stock: 20,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"
  },
  {
    name: "Classic Wrist Watch",
    description: "Elegant stainless steel analog watch.",
    price: 7499,
    category: "Fashion",
    stock: 25,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
  },
  {
    name: "Sunglasses",
    description: "UV-protected polarized sunglasses.",
    price: 1999,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"
  },
  {
    name: "Cotton Hoodie",
    description: "Soft fleece hoodie for everyday wear.",
    price: 2499,
    category: "Clothing",
    stock: 32,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
  },
  {
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support.",
    price: 8999,
    category: "Furniture",
    stock: 11,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400"
  },
  {
    name: "Wooden Desk",
    description: "Minimalist wooden computer desk.",
    price: 12999,
    category: "Furniture",
    stock: 9,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400"
  },
  {
    name: "Coffee Maker",
    description: "Automatic drip coffee machine.",
    price: 4999,
    category: "Home Appliances",
    stock: 18,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"
  },
  {
    name: "Air Fryer",
    description: "Digital air fryer with 5L capacity.",
    price: 6999,
    category: "Home Appliances",
    stock: 16,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
  },
  {
    name: "Vacuum Cleaner",
    description: "Bagless vacuum cleaner with HEPA filter.",
    price: 8499,
    category: "Home Appliances",
    stock: 13,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400"
  },
  {
    name: "Yoga Mat",
    description: "Non-slip exercise yoga mat.",
    price: 1499,
    category: "Fitness",
    stock: 38,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400"
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set for home workouts.",
    price: 7999,
    category: "Fitness",
    stock: 14,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"
  },
  {
    name: "Camping Tent",
    description: "4-person waterproof camping tent.",
    price: 10999,
    category: "Outdoor",
    stock: 7,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400"
  },
  {
    name: "Mountain Bike",
    description: "21-speed mountain bicycle with disc brakes.",
    price: 24999,
    category: "Sports",
    stock: 5,
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400"
  },
  {
    name: "Travel Suitcase",
    description: "Hard-shell luggage with spinner wheels.",
    price: 6999,
    category: "Travel",
    stock: 17,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"
  },
  {
    name: "Water Bottle",
    description: "Insulated stainless steel water bottle.",
    price: 999,
    category: "Lifestyle",
    stock: 60,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"
  },
  {
    name: "Notebook",
    description: "Premium hardcover ruled notebook.",
    price: 499,
    category: "Stationery",
    stock: 80,
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400"
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness.",
    price: 1799,
    category: "Home Decor",
    stock: 26,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400"
  },
  {
    name: "Indoor Plant",
    description: "Low-maintenance indoor plant in ceramic pot.",
    price: 899,
    category: "Home Decor",
    stock: 29,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400"
  },
  {
    name: "Gaming Controller",
    description: "Wireless controller compatible with PC and console.",
    price: 3999,
    category: "Gaming",
    stock: 21,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Admin user dhoondo (createdBy ke liye)
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log("No admin user found! Pehle ek admin user banao.");
      process.exit(1);
    }

    // Purane seeded products delete karo (optional)
    await Product.deleteMany({});
    console.log("Old products cleared");

    // Naye products add karo
    const productsWithAdmin = products.map(p => ({ ...p, createdBy: admin._id }));
    await Product.insertMany(productsWithAdmin);
    console.log(`✅ ${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seed();