import mongoose from 'mongoose';

const connectDB = async (mongoUri: string) => {
    if (!mongoUri) {
        console.error('MONGO_URI not found in .env file');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;