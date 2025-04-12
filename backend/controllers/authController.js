import db from '../config/knex.js';
import passport from '../config/passportConfig.js'
import bcrypt from 'bcrypt';

const registerController = async (req, res) => {
  const { fullName, email, password } = req.body;
  const saltRounds = 10;

  if(!fullName || !email || !password) {
    return res.status(400).json({ title: 'Invalid Submission', description: 'Please enter all the required fields.' });
  }

  try {
    const duplicateUser = await db('users').where({ email }).first();

    if (duplicateUser) {
      return res.status(400).json({title: 'Email Already Registered', description: 'An account with this email already exists.'});
    }

    const password_hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    await db('users').insert({
      full_name: fullName,
      profile_picture: '',
      email: email,
      password_hash,
      is_verified: true,
    })

    console.log("User added");
    return res.status(200).json({ message: 'Register successful' });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({title: 'Registration Error', description: 'Something went wrong while registering. Try again.'});
  }
}

const loginController = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({title: info.title, description: info.description});
    }

    req.login(user, (err) => {
      if (err) return next(err);
      console.log("Logged in");
      const userData = {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
      };
      req.session.user = userData;
      return res.status(200).json({ message: 'Login successful', user: userData });
    });
  })(req, res, next);
};

const infoController = (req, res) => {
  console.log("Info was asked");
  return res.json({ message: req.user });
};

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({message: 'Logout failed'});
    }
    res.clearCookie('hieroglyph-secret-key')
    return res.status(200).json({ message: 'Logged out successfully' });
  });
}

export { registerController, loginController, infoController, logoutController };