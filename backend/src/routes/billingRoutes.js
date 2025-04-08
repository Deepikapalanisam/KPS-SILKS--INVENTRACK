// routes/billingRoutes.js
const express = require("express");
const { createBill, getAllBills } = require("../controllers/BillingController");

const router = express.Router();

// Route to create a new bill
router.post("/", createBill);

// Route to fetch all bills
router.get("/", getAllBills);

module.exports = router;
