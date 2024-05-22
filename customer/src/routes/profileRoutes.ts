import express from 'express';
import passport from 'passport';
import { editUser, getUser, getUserAllCodecamps, getUserCodecampById, markOrUnmarkCompletion, terminateAccount } from '../controller/profileController';
import authenticateUser from '../middleware/authenticateUser';


const router = express.Router();

router.get('/profile',authenticateUser,getUser);
router.get('/codecamp',authenticateUser,getUserAllCodecamps);
router.get('/codecamp/:id',authenticateUser,getUserCodecampById);
router.patch('/edit-profile',authenticateUser,editUser);
router.delete('/delete-account',authenticateUser,terminateAccount);
router.patch('/completion/update',authenticateUser,markOrUnmarkCompletion);
// router.get('/anshid',authenticateUser,getUser);

export default router ;