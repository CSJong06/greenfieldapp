import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import flash from 'connect-flash';
import authRoutes, { requireAuth } from './routes/auth.js'; // Importing requireAuth
import dashboardRoutes from './routes/dashboard.js';
import { fileURLToPath } from "url";
import http from 'http';

// Setup Server and Application config 
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the directory name

app.use(flash());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({  limit: '10kb' })); // Limits the body size
app.use(express.urlencoded({ extended: true,  limit: '10kb' }));

app.use(cookieParser());
// Set trust proxy to handle rate limiting behind proxy
app.set('trust proxy', 1);
app.use(cors());

app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// User Session 
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Global middleware for user session
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

// Required Authorization for Router
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// Dashboard routes handled in dashboardRoutes
app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    res.render('dashboard');
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
});

server.listen(PORT, () => { // port is passed here
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(); // blank log to make console out more readable
});
