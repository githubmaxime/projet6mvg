const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
require('dotenv').config();

mongoose.connect('mongodb+srv://'+ process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@cluster0.iajdy8a.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie!'))
    .catch(() => console.log('Connexion à MongoDB échouée!'))

const app = express();

var helmet = require('helmet');
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); //fix helmet not same origin error
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
  
  app.use('/api/books', bookRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
module.exports = app;