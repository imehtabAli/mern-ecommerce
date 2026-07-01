const mongoose = require('mongoose');

const ConnectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose Connected!");
}

module.exports = ConnectDB;