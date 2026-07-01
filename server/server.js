const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
app.use(cors());
app.use(express.json());
const connectDB = require("./config/db");
connectDB();

app.get('/', async (req, res)=>{
    res.send("Server is live.")
});

app.use('/api/auth', require("./routes/authRoute"));
app.use('/api/products', require('./routes/productRoute'));
app.use("/api/cart", require("./routes/cartRoute"));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/users', require("./routes/userRoute"));
app.use('/api/ai', require('./routes/aiRoute'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server is listening to PORT: ${process.env.PORT}`);
})