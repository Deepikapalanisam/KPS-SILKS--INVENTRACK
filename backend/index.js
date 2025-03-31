const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const supplierRoutes = require("./src/routes/supplierRoutes");
const purchaseRoutes = require("./src/routes/purchaseRoutes");
const stockRoutes = require("./src/routes/stockRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/suppliers", supplierRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/stock', stockRoutes); // ✅ Ensure the route is "/stock"

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
