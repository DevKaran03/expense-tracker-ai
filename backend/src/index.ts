import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expenseRoutes';
import { initDB } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', expenseRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
