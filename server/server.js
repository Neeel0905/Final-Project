const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const port = process.env.PORT || 3000;
const mongodbUri = process.env.DB_URI || 'mongodb+srv://neelfinal:abc123123@final.s39tm01.mongodb.net/';

app.use(bodyParser.json());
app.use(express.json()); 
app.use(cors());

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', cartItemRoutes);
app.use('/api', categoryRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
