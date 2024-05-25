import { NextFunction, Request, Response } from "express";

import userModel from '../model/userSchema';
import userCodecampsModel from "../model/userCodecampsSchema";
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

export const getUserCodecampById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user as string ;
        const codecampId = req.params.id;

        console.log(codecampId,'codecampId',userId)

        if (!userId || !codecampId) {
            throw next(new BadRequestError('Invalid credentials'));
        }
        
        const codecamp = await userCodecampsModel.findOne({ userId, codecampId });
        console.log(codecamp,'user codecampooooooo');

        if (codecamp) {
            res.status(200).json({
                status: true,
                data: codecamp,
                message: 'Success',
            });
        }else {
            res.status(200).json({
                status: false,
                data: null,
                message: 'failure',
            });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
} 

export const getUserAllCodecamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user as string ;

        if (!userId) {
            throw next(new BadRequestError('Invalid credentials'));
        }


        const codecamps = await userCodecampsModel.find({userId});
        console.log(codecamps,'anshyyyyyyyyy')

        if (!codecamps) {
            throw next(new BadRequestError('User didnt have any codecamps'));
        }

        res.status(200).json({
            status: true,
            data: codecamps,
            message: 'Success',
        });


    } catch (error) {
        console.log(error);
        next(error);
    }
}

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
        
        const isPasswordValid = await passwordCompare(password, user.password as any);
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
        const { contentId, codecampId, length } = req?.body;

        if (!userId || !codecampId || !contentId) {
            throw new BadRequestError('Invalid credentials');
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new BadRequestError('User not found');
        }

        const codecamp = await userCodecampsModel.findOne({ userId, codecampId });
        if (!codecamp) {
            throw new BadRequestError('Codecamp not found in user codecamps');
        }

        let completedContents = [...codecamp.completedContents]; // Clone the array

        // Check if the contentId exists in the completedContents array of the codecamp
        const index = completedContents.indexOf(contentId);
        if (index !== -1) {
            // ContentId exists, remove it from the array
            completedContents.splice(index, 1);
        } else {
            // ContentId doesn't exist, add it to the array
            completedContents.push(contentId);
        }

        const codeCampProgress = (completedContents.length / length) * 100;

        // Update the document with the modified fields
        const userCodecamp = await userCodecampsModel.findByIdAndUpdate(
            codecamp._id,
            { completedContents, codeCampProgress },
            { new: true } // Return the updated document
        );

        res.status(200).json({ status: true, user: userCodecamp, message: 'Success' });
        
        
    } catch (error) {
        next(error);
    }
}

const userCodecampsList = async ( userId:string, data:any ) => {
    try {

        if (!data || !userId) {
            return new BadRequestError('Invalid credentials');
        }

        // Use the utility function to pick only the required fields
        const { codecampId, title, description, thumbnail } = pickCodecampsData(data);

        const codecampExists = await userCodecampsModel.findOne({
            userId: userId,
            codecampId,
        });

        console.log(codecampExists,'checking codecamps exists');

        if(codecampExists){
            return new BadRequestError('Already enrolled');
        }

        const newUserCodecamp = new userCodecampsModel({
            userId,
            codecampId,
            title,
            description,
            thumbnail
        });

        const savedCamp = await newUserCodecamp.save();
        console.log(savedCamp);

        return({status:true, message: 'User enrolled the codecamp' });

    } catch (error) {
        throw(error);
    }
}


const updateUsersCodecamp = async (data:any) => {
    try {
        console.log('data', data);
        if (!data) {
            return new BadRequestError('Invalid credentials');
        }

        const { codecampId, title, description, thumbnail } = pickCodecampsData(data);

        // Update documents that match the specified codecampId
        const result = await userCodecampsModel.updateMany(
            { codecampId: codecampId },
            { $set: { title, description, thumbnail } }
        );

        console.log(result);


    } catch (error) {
        throw(error);
    }
}



export const SubscribeEvents = (payload:any) => {
     
    const { event, data, userId } = JSON.parse(payload) ;
    try {
        switch(event){
            case 'CODECAMP_ENROLLED':
                userCodecampsList(userId,data)
                break;

            case 'CODECAMP_UPDATED':
                console.log('codecamp updated cheyy')
                updateUsersCodecamp(data)
                break;
            default:
                break;
        }
        
    } catch (error) {
        throw(error)
    }

}

