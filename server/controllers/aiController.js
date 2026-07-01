const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateDescription = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required." });
        }

        const interaction = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: `Write a short, appealing ecommerce product description (2-3 sentences) for a product named "${name}" in the category "${category}". Make it sound professional and persuasive.`,
        });

        const description = interaction.output_text;

        res.status(200).json({ description });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.smartSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: "Search query is required." });

        const products = await Product.find().select('name category description price');

        const productListText = products
            .map((p) => `ID: ${p._id}, Name: ${p.name}, Category: ${p.category}, Description: ${p.description}`)
            .join('\n');

        const prompt = `Here is a list of products:\n${productListText}\n\nUser is searching for: "${query}"\n\nReturn ONLY a JSON array of the matching product IDs (most relevant first), like: ["id1", "id2"]. If nothing matches, return [].`;

        const interaction = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: prompt,
        });

        let matchedIds = [];
        try {
            const cleanText = interaction.output_text.replace(/```json|```/g, '').trim();
            matchedIds = JSON.parse(cleanText);
        } catch (parseError) {
            return res.status(500).json({ message: "Failed to parse AI response." });
        }

        const matchedProducts = await Product.find({ _id: { $in: matchedIds } });

        res.status(200).json(matchedProducts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.chatbotQuery = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required." });

        let orderContext = "";
        if (req.user) {
            const recentOrders = await Order.find({ user: req.user._id })
                .sort({ createdAt: -1 })
                .limit(3);
            orderContext = recentOrders
                .map((o) => `Order ${o._id}: Status - ${o.orderStatus}, Amount - ₹${o.totalAmount}`)
                .join('\n');
        }

        const prompt = `You are a helpful customer support assistant for an ecommerce store.
    
Store policies: Standard delivery takes 5-7 business days. Returns accepted within 7 days of delivery. Full refund on cancellation before shipping.

User's recent orders:
${orderContext || "No recent orders found."}

User's question: "${message}"

Give a short, helpful, friendly response.`;

        const interaction = await ai.interactions.create({
            model: 'gemini-2.5-flash',
            input: prompt,
        });

        res.status(200).json({ reply: interaction.output_text });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};