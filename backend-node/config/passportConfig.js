import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './knex.js';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await db('users').where({ email }).first();
    if (!user) return done(null, false, {title: 'Account Not Found', description: 'We couldn\'t find an account with that email.'});
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return done(null, false, { title: 'Invalid Credentials', description: `The email/password you entered is incorrect.`});
    if (!user.is_verified) return done(null, false, { title: 'Email Not Verified', description: 'Please verify your email before logging in.'});

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await db('users').where({ email }).first();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
