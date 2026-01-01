import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database';
import { config } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import projectRoutes from './routes/projects';
import skillRoutes from './routes/skills';
import testimonialRoutes from './routes/testimonials';
import settingsRoutes from './routes/settings';

const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.env}`);
    console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});

export default app;
