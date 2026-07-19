import mongoose from "mongoose";


let isConnected = false;

const connectDb = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Fail quickly if IP is blocked
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("🔥 CRITICAL DB ERROR:", error.message);
        console.error("1. Check if MONGODB_URI is exactly correct in Vercel without quotes.");
        console.error("2. Check if MongoDB Atlas Network Access is set to 0.0.0.0/0");
    }
}

export default connectDb; 