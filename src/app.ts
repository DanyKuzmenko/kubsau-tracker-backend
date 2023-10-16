import express from 'express';
import mongoose from 'mongoose';
import cardRoutes from './routes/cardRoutes';
import { swaggerSpec } from './swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

const ENV_PATH = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: ENV_PATH });


const DB_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

if (DB_URL) {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
} else {
  console.error('MONGODB_URI environment variable is not defined');
}

app.use(express.json());

app.use('/api', cardRoutes);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
