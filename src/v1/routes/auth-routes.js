import express from 'express';
import { body } from 'express-validator';
import { signUpController } from '../controllers/auth/auth.js';
import { errorHandler } from '../utils/errorHandler.js';

const route = express.Router();

route.post('/signup',
  [
    body('name').isLength({ min: 3 }).withMessage('at least three characters'),
    body('userName').isLength({ min: 3 }).withMessage('at least three characters'),
    body('email').normalizeEmail().isEmail().withMessage('please enter a valid Email'),
    body('password').isStrongPassword().withMessage('please enter a strong password'),
  ], errorHandler, signUpController
);

export default route;