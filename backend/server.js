import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection  
connectDb();

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is Running Successfully"
    });
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
}); 