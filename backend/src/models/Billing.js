const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
