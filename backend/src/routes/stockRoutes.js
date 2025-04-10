const express = require('express');
const router = express.Router();
const { getStock, updateStock } = require('../controllers/stockController');

// GET all stock items
router.get('/', getStock);

// ✅ PUT /stock/:id - Update stock quantity
router.put('/:id', updateStock);

module.exports = router;
