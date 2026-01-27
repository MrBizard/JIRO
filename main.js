require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');

const taskRoutes = require('./routes/tasks');

const app = express();

// Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Routes
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.use('/', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port localhost:${PORT}`);
});
