import express from 'express';
import mongoose from 'mongoose';
import tasksRoutes from './routes/tasksRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import groupRoutes from './routes/groups';
import { swaggerSpec } from './swagger/swaggerInitialization';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandling';
import { errorLogger, requestLogger } from './middleware/logger';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  }),
);

const ENV_PATH =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
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

// request logger
app.use(requestLogger);

// routes
app.use('/api', tasksRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', groupRoutes);

// error logger
app.use(errorLogger);

// error handler boom
app.use(errorHandler);

// swagger
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
