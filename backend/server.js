import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json());

// 2. Health Check Endpoint (useful for testing Render deployment)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is active and running' });
});

// 3. Mount User API Routes
app.use('/api/users', userRoutes);

// 4. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 5. Port Configuration (Render uses process.env.PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});