import express from 'express';
import  {body} from 'express-validator';
import { errorHandler } from '../utils/errorHandler';
import 
const route = express.Router();

route.post('/signup',
[
  body('name').isLength({min:3}).withMessage('at least three characters'),
  body('userName').isLength({min:3}).withMessage('at least three characters'),
  body('email').normalizeEmail().isEmail().withMessage('please enter a valid Email'),
  body('password').not().isStrongPassword().withMessage('please enter a strong password'),
],errorHandler,)