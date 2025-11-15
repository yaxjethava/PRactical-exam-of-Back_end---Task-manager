const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: '.env' });

const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (error) {
      res.clearCookie('token');
    }
  } else {
    res.locals.user = null;
  }
  next();
});

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { isAuthenticated } = require('./middleware/authMiddleware');

app.use('/', authRoutes);
app.use('/', taskRoutes);
app.use('/', categoryRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login', { message: null });
});

app.get('/register', (req, res) => {
  res.render('register', { message: null });
});

app.use((req, res) => {
  res.status(404).render('error', { message: '404 - Page not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: 'An error occurred' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
