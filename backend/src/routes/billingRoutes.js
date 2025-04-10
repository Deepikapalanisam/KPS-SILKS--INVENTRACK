// routes/billingRoutes.js
const express = require("express");
const router = express.Router();
const { createBill, getAllBills } = require("../controllers/BillingController");

// POST /api/billings - Create a new bill
router.post("/", createBill);

// GET /api/billings - Get all bills
router.get("/", getAllBills);

module.exports = router;
