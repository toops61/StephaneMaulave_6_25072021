const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const password = process.env.PASSWORD;
const uri = 'mongodb+srv://invite:' + password + '@cluster0.9fdzy.mongodb.net/Projet6?retryWrites=true&w=majority';
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
 

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;