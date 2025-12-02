import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Restroom from '../models/restroomModel.js';
import { restrooms } from '../data/restrooms.transform.js';

dotenv.config();

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI not found.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    await Restroom.deleteMany({});
    console.log('Existing restroom data deleted.');

    await Restroom.insertMany(restrooms);
    console.log(`Database seeded successfully with ${restrooms.length} restrooms.`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();