
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');  // Import the path module
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./Routes/bookingRoutes');
const userRoutes = require('./routes/auth');
const servicesRoutes = require('./Routes/servicesRoutes');
const contactRoutes = require('./Routes/contactRoutes');
const vehicleRoutes = require('./Routes/vehicleRoutes');
const routeRoutes = require('./Routes/routeRoutes');
const airportRoutes = require('./Routes/airportRoutes');
const hotelRoutes = require('./Routes/hotelRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(bodyParser.json({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
}));

app.use(cors({
  origin: "https://johnwayneshuttle.com",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected successfully to MongoDB');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', authRoutes);
app.use('/api/auth', (req, res, next) => {
  console.log('API request:', req.method, req.originalUrl);
  next();
}, authRoutes);

app.use('/api', bookingRoutes);
app.use('/api', userRoutes);
app.use('/api', servicesRoutes);
app.use('/api', contactRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/notifications', notificationRoutes);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
