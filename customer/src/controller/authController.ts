import { NextFunction, Request, Response } from "express";

import userModel from '../model/userSchema'
import Token from '../model/userToken';

import { BadRequestError } from "../errors/bad-request-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { generateSalt, generatePasswordHash, generateToken, passwordCompare, removePasswordField } from '../utils';
import { UserProfile } from "../Types/types";
import { config } from "../configs/envConfiguration";
import { sendMail } from "../utils/emailSend";


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const { email, name, password } = req.body;

        // Check if user already exists
        const userEmailExists = await userModel.findOne({ email });
        if (userEmailExists) {
            throw next(new BadRequestError('Email already exists'));
        }
        
        // Hash password and save user
        const salt: string = await generateSalt();
        const hashedPassword: string = await generatePasswordHash(password, salt)
        const newUser = new userModel({
            email,
            name,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        
        // Generate JWT token
        const token: string = await generateToken(savedUser._id as string,'2d');

        res.status(201).send({
            status: true,
            user : removePasswordField(savedUser.toObject()),
            message: 'User created successfully',
            token
        });

    } catch (error) {
        next(error);
    }
}


export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        // Try to find the user in the database. If user is not found, return error
        const existingUser = await userModel.findOne({ email });
        if(!existingUser) {
            throw next(new BadRequestError('User not found'));
        }
        
        // Check if the provided password matches the one in the database
        const isMatched = await passwordCompare(password, existingUser.password)
        
        if(!isMatched ) {
            throw next(new BadRequestError('Incorrect credentials'));
        }

        // Generate a JWT token for the user
        const token: string = await generateToken(existingUser._id as string,'2d')

        return res.status(200).json({
          status: true,
          user : removePasswordField(existingUser.toObject()),
          message: 'Signin successfully',
          token
        });

    } catch (error) {
        next(error);
    }
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req?.user as UserProfile )?._id
        const token: string = await generateToken(userId as string,'2d')
        res.redirect(`http://localhost:3000/profile?token=${token}`);
    } catch (error) {
        return res.status(500).json({ status: false, message: 'An internal server error occurred', error });
    }
};


export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email }  = req.body;
        // Try to find the user in the database. If user is not found, return error
        const existingUser =  await userModel.findOne({ email });
        console.log(existingUser)
        if(!existingUser) {
            throw next(new BadRequestError('User not found'));
        }

        const userId = existingUser._id;
        const token: string = await generateToken(userId as string,`${(30*60)}`)
        
        const userToken = await new Token({
            userId,
            token
        }).save();
        
        const link = `${config.BASE_URL}/reset-password/user/${userId}/${token}?reset=true`;
        await sendMail(email,'reset-password',link);

        return res.status(200).json({
            status: true,
            message: 'success',
        });
    } catch (error) {
        next(error);
    }
}


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, token } = req.params;
        const existUser = userModel.findOne({id});
        if(!existUser) {
            throw next(new BadRequestError('User not found'));
        }

        const userToken = await Token.findOne({
            userId:id,
            token:token
        })
        console.log(userToken);
        if(!userToken) {
            throw next(new BadRequestError('Invalid link'));
        }

        return res.status(200).json({
            status: true,
            message: 'Link is valid',
        });

    } catch (error) {
        next(error);
    }
};



export const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        console.log(req.body)
        const { userId, token, password} = req.body
        const resetToken = await Token.findOne({ userId, token });
        if (!resetToken) {
            throw next(new BadRequestError('Invalid link'));
        }
        
         // Hash password and save user
        const salt: string = await generateSalt();
        const hashedPassword: string = await generatePasswordHash(password, salt)
        
        const user = await userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
        });
        await resetToken.deleteOne();
        
        res.status(200).json({status:true, message: "PASSWORD UPDATED SUCCESSFULLY!!!" });
       
    } catch (error) {
        
    }
}