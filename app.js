const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const tripsRoutes = require('./routes/trips');
const authRoutes = require('./routes/auth');
const bookingsRoutes = require('./routes/bookings');
const dashboardRoutes = require('./routes/dashboard');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/content', contentRoutes);

app.use(errorHandler);

module.exports = app;
