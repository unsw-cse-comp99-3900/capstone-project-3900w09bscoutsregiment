// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
import User from '../model/User.js';

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '308194862827-fd19uj11slbj2su5tuvsm73ffrj138uo.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = new User({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          done(null, user);
        } catch (e) {
          done(error, false);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
