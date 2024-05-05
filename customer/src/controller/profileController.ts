import { NextFunction, Request, Response } from "express";

import userModel from '../model/userSchema';
import { BadRequestError } from "../errors/bad-request-error";
import { UserProfile } from "../Types/types";
import { passwordCompare, pickCodecampsData, removePasswordField } from "../utils";
import { send } from "process";


export const getUser = async (req: Request, res: Response, next: NextFunction ) => {
    try {

        const userId = req?.user as string 
        console.log(userId);
        if (!userId) {
            throw next(new BadRequestError('Invalid credentials'));
        }

        const userData = await userModel.findById({ _id: userId });
        console.log(userData)
        if (!userData) {
            throw next(new BadRequestError('User not found'));
        }

        const  user = removePasswordField(userData.toObject())
        console.log(user,'hehe')
        res.status(200).json({
            status: true,
            message: 'User profile retrieved successfully',
            user:user
        });

    } catch (error) {
        console.error('Error in userProfile:', error);
        next(error);
        // res.status(500).json({ status: false, message: 'Internal server error' });
    }
};



export const editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user as UserProfile;
        const formData = req.body;

        // Check for missing data
        if (!formData || !userId) {
            throw next(new BadRequestError('Invalid credentials'));
        }

        // Extract social media links from request body
        const socialMediaLinks = {
            instagram: formData.instagram,
            facebook: formData.facebook,
            discord: formData.discord,
            linkedin: formData.linkedin,
            twitter: formData.twitter
        };

        // Update user profile in the database
        await userModel.findByIdAndUpdate(userId, {
            profileImage: formData.selectedImage || null,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            bio: formData.about,
            socialMediaLinks
        });

        res.status(200).json({
            status: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


export const terminateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user as UserProfile;
        console.log(req.body)
        const { password } = req.body ;

        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            throw next(new BadRequestError('User not found'));
        }

        // Perform additional checks (e.g., password confirmation)
        if (!password) {
            throw next(new BadRequestError('Password confirmation is required'));
        }
        
        const isPasswordValid = await passwordCompare(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            throw next(new BadRequestError('Invalid password confirmation'));
        }

        // Delete the user account
        await userModel.findByIdAndRemove(userId);

        res.status(200).json({ status: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        next(error);
    }
}

export const markOrUnmarkCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user;
        const { contentId,codecampId,length } = req?.body;
        console.log( contentId,codecampId,length,userId)
        console.log('hellpppppp')

        // Check if both user ID and code camp ID are provided
        if (!userId || !codecampId || !contentId) {
            throw new BadRequestError('Invalid credentials');
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new BadRequestError('user not found');
        }

        // Check if the codecampId exists in the user's codecamps array
        const codecamp = user?.codecamps.find(camp => camp.codecampId === codecampId);
        if (!codecamp) {
            // Codecamp not found in user's codecamps array
            throw new BadRequestError('Codecamp not found in user codecamps');
        }

        // Check if the contentId exists in the completedContents array of the codecamp
        const completedContents = codecamp?.completedContent || [];
        const index = completedContents.indexOf(contentId);
        if (index !== -1) {
            // ContentId exists, remove it from the array
            completedContents.splice(index, 1);
        } else {
            // ContentId doesn't exist, add it to the array
            completedContents.push(contentId);
        }


        // const totalContents = codecamp?.codecampData?.length || 0;
        const codeCampProgress = (completedContents.length / length ) * 100;

        codecamp.completedContent = completedContents;
        codecamp.progress = codeCampProgress;
        const userData = await user.save();

        // // Update the completedContents array of the codecamp
        res.status(200).json({ status: true,user:userData, message: 'success' });
        
    } catch (error) {
        next(error);
    }
}

const addToCodecampsList = async (userId:string,data:any) => {
    try {
        // console.log(userId,data);
        // console.log('anshyyy evade kitty daaaa')
        if (!data || !userId) {
            return new BadRequestError('Invalid credentials');
        }

        // Use the utility function to pick only the required fields
        const codecampsData = pickCodecampsData(data);

        const existingUser = await userModel.findOne({
            _id: userId,
            'codecamps.codecampId': codecampsData.codecampId
        });

        if(existingUser){
            return new BadRequestError('Already enrolled');
        }

        // Find the user by ID and update
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $push: { codecamps: codecampsData } }, // Pushes the new codecamp data into the codecamps array
            { new: true } // Returns the modified document rather than the original
        );
        if (!updatedUser) {
            return new BadRequestError('User not found');
        }

        return({status:true, message: 'User enrolled the Code camp' });
    } catch (error) {
        throw(error);
    }
}




export const SubscribeEvents = (payload:any) => {
     
    const { event, data,userId } = JSON.parse(payload) ;
    console.log(event,'----')
    // const { userId, product, order, qty } = data;
    // console.log('orderrrrr',order)
    try {
        switch(event){
            case 'CODECAMP_ENROLLED':
            // case 'REMOVE_FROM_WISHLIST':
                console.log('set ayeda mowne')
                
                addToCodecampsList(userId,data)
                break;
             
            default:
                break;
        }
        
    } catch (error) {
        
    }

}

