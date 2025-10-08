import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../utils/connectDB.js';
import restroomRoutes from '../routes/restroomRoutes.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/restrooms', restroomRoutes);

const startServer = async () => {
    await connectDB(process.env.MONGO_URI!); 

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();