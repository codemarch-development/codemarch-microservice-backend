import express from 'express';
import passport from 'passport';
import { editUser, getUser, markOrUnmarkCompletion, terminateAccount } from '../controller/profileController';
import authenticateUser from '../middleware/authenticateUser';


const router = express.Router();

router.get('/profile',authenticateUser,getUser);
router.patch('/edit-profile',authenticateUser,editUser);
router.delete('/delete-account',authenticateUser,terminateAccount);
router.patch('/completion/update',authenticateUser,markOrUnmarkCompletion);

router.get('/anshid',authenticateUser,getUser);

export default router ;