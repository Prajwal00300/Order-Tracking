import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


connectDb();


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is Running Successfully"
    });
});


app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
}); 