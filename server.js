const express = require('express');
const math = require('mathjs');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/calculatorDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define a schema for calculations
const calculationSchema = new mongoose.Schema({
  expression: String,
  result: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the calculations
const Calculation = mongoose.model('Calculation', calculationSchema);

app.use(express.static('public'));
app.use(express.json());

// Endpoint to handle calculation
app.post('/calculate', async (req, res) => {
  const { expression } = req.body;
  try {
    // Use mathjs to safely evaluate the expression
    const result = math.evaluate(expression);

    // Save the calculation to MongoDB
    const newCalculation = new Calculation({ expression, result });
    await newCalculation.save();

    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

app.listen(port, () => {
  console.log(`Calculator app listening at http://localhost:3000`);
});
