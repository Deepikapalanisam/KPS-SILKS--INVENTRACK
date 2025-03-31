const Stock = require('../models/Stock');

exports.getStock = async (req, res) => {
    try {
        const stock = await Stock.find().populate('supplier', 'name');
        res.json(stock.map(item => ({
            _id: item._id,
            name: item.name,
            category: item.category, // ✅ Ensure category is included
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            supplier: item.supplier.name // ✅ Send supplier name as string
        })));
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
