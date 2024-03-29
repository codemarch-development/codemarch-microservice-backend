import express from 'express';
import passport from 'passport';
import { signup, signin, googleLogin, forgetPassword, verifyToken, resetPassword } from '../controller/authController';
import authenticateUser from '../middleware/authenticateUser';
import { userValidationRules, userSigninValidationRules } from '../utils/validationSyncs';
import { requestValidation } from '../middleware/requestValidation';

const router = express.Router();
// userValidationRules(),requestValidation
router.post('/signup',signup);
router.post('/signin',userSigninValidationRules(),requestValidation,signin);
router.get('/google', passport.authenticate("google",{ scope: ['profile', 'email'] }));
router.get('/callback/google',passport.authenticate("google", {session:false}),googleLogin);
router.post('/forget-password',forgetPassword);
router.post('/reset-password',resetPassword);
router.get('/verify-token/:id/:token',verifyToken);


export default router ;  