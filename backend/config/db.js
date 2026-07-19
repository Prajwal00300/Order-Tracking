import mongoose from "mongoose";


const connectDb = async () => {
    // readyState 1 means fully connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("🔥 CRITICAL DB ERROR:", error.message);
    }
}

export default connectDb; 