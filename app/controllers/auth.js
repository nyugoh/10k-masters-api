import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
const router = express.Router();
import User from '../models/User';

module.exports = (app) => {
  app.use('/api/v1/auth', router);
};

router.post('/login', passport.authenticate('local-login', {
  failWithError: true
}), (req, res, next) =>{
  // Handle success
  return res.json({id: req.user._id});
}, (error, req, res, next) =>{
  // Handle error
  return res.json(500, error);
});

router.post('/register', passport.authenticate('local-register', {
  failWithError: true
}), (req, res, next) => {
  return res.json({id: req.user._id});
}, (error, req, res, next) =>{
  return res.json(500, error);
});

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => done(error, user));
});

passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  User.findOne({email:email}, function(err, user) {
    if (err) return done(err);
    if (user) {
      return done(null, false, {message: 'User already exist.'});
    } else {
      var newUser = new User({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: email,
        password: password
      });
      User.createUser(newUser, function (err, user) {
        if (err) {
          return done(null, false, {message: 'Error creating user'});
        } else {
          return done(null, user);
        }
      });
    }
  });
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) =>{
  User.findOne({email:email}, (error, user) =>{
    if (error) return done(error);
    if (!user) {
      return done(null,  false, {message: 'User doesn\'t exist.'});
    } else {
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect email/password.'});
        }
      });
    }
  });
}));
