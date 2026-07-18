import mongoose from "mongoose";


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected");

    }
    catch (error) {
        console.error("Error in Mongo DB connection", error)
    }
}

export default connectDb; 