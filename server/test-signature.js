const crypto = require('crypto');

const razorpay_order_id = "order_T4uyHBvp4B1Pgf";
const fake_payment_id = "pay_test123456789";
const secret = "S5y9H6OB1GwiWvolAGXepuQu";
console.log(secret);


const signature = crypto
  .createHmac('sha256', secret)
  .update(`${razorpay_order_id}|${fake_payment_id}`)
  .digest('hex');

console.log("razorpay_order_id:", razorpay_order_id);
console.log("razorpay_payment_id:", fake_payment_id);
console.log("razorpay_signature:", signature);