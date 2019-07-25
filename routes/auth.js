const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// /login => GET
router.get('/login', authController.getLogin);

// /login => POST
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

// /signup => GET
router.get('/signup', authController.getSignup);

// /signup => POST
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.gr') {
        //   throw new Error('This email address is forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'This email already exists. Please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);

// /logout => POST
router.post('/logout', authController.postLogout);

// /reset => GET
router.get('/reset', authController.getReset);

// /reset => POST
router.post('/reset', authController.postReset);

// /reset/:token => GET
router.get('/reset/:token', authController.getNewPassword);

// /new-password => POST
router.post('/new-password', authController.postNewPassword);

module.exports = router;
