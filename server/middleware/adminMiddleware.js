const isAdmin = (req, res, next) => {
    try {
        const role = req.user.role;
        if (role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = isAdmin;