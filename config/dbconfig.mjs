import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('error', () => {
  console.log("Error Connecting to database");
});

connection.on('connected', () => {
  console.log("Connected to database");
});

export default connection;
