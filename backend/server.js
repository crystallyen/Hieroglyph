import express from 'express'
import session from 'express-session';
import passport from './config/passportConfig.js'
import authRouter from './routes/authRoutes.js'
import cors from 'cors'

const app = express()

const port = process.env.PORT || 3001

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'hieroglyph-secret-key',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});