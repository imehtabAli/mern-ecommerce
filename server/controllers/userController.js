const User = require("../models/userModel");

exports.getProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.makeAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ message: "User promoted to admin.", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};