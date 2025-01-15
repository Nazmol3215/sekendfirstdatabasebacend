const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://your-vercel-url.vercel.app', // আপনার Vercel ফ্রন্টএন্ড URL
    methods: ['GET', 'POST'], // অনুমোদিত HTTP মেথড
    credentials: true // প্রয়োজন হলে কুকি বা অথরাইজেশন
}));
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://FirstDatabase:FirstDatabasePoossword@cluster0.6mhj7.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    address: String,
    quantity: Number,
    subtotal: Number,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// API Route
app.post('/api/orders', async (req, res) => {
    try {
        const { name, mobile, address, quantity, subtotal } = req.body;

        const newOrder = new Order({ name, mobile, address, quantity, subtotal });
        await newOrder.save();

        res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
