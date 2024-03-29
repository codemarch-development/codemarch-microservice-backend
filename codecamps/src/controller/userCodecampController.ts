import { NextFunction, Request, Response } from "express";
import CodeCamp from '../model/codeCampSchema';
import UserCodeCamp from '../model/userCodeCampSchema';
import { BadRequestError } from "../errors/bad-request-error";
import { PublishMessage, getPayload } from "../utils";
import { config } from "../configs/envConfiguration";
import { Channel } from "amqplib";



// Function to enroll a user in a course
export const userCodeCampEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req?.user;
        const { rabbitMQChannel } : any = global
        const { codecampId } = req.body;
        
        // Check if both user ID and course ID are provided
        if (!userId || !codecampId) {
            throw new BadRequestError('Invalid credentials');
        }
        
        // Check if the user is already enrolled in the course
        const existingEnrollment = await UserCodeCamp.findOne({ userId, codecampId });
        if (existingEnrollment) {
            throw new BadRequestError('User is already enrolled this Code Camp');
        }
        
        // Check if the course exists
        const codeCamp = await CodeCamp.findById(codecampId);
        if (!codeCamp) {
            throw new BadRequestError('Code Camp not found');
        }
        
        // // Create a new UserCourse document
        // const userCodeCamps = new UserCodeCamp({
        //     userId,
        //     codecampId,
        // })

        
        // // Save the userCourse to the database
        // await userCodeCamps.save()
        // const populatedUserCodeCamp = await UserCodeCamp.findById({_id:userCodeCamps._id}).populate('codecampId');

        const payload = getPayload(codeCamp,'CODECAMP_ENROLLED',userId)
        if (rabbitMQChannel) {
            await PublishMessage(rabbitMQChannel, config.CUSTOMER_BINDING_KEY, JSON.stringify(payload));
        } else {
            console.error('Channel is undefined. Unable to publish message.');
        }
        
        res.status(201).json({status:true,data:codeCamp, message: 'User enrolled the Code camp' });
    } catch (error) {
        next(error);
    }
}

// export const myCodecamps = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log('hahhahahaha')
//         const userId = req?.user;
//         console.log(userId,'-----')

//         if (!userId) {
//             throw new BadRequestError('Invalid credentials');
//         }

//         const userCodecamps = await UserCodeCamp.find({ userId }).populate('codecampId')
//         console.log(userCodecamps)
//         res.status(201).json({status:true,data:userCodecamps, message: 'User enrolled Codecamps' });

//     } catch (error) {
//         next(error);
//     }
// }


export const markOrUnmarkCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('hlooo')
        const userId = req?.user;
        const { contentId,codecampId } = req?.body;

        // Check if both user ID and code camp ID are provided
        if (!userId || !codecampId || !contentId) {
            throw new BadRequestError('Invalid credentials');
        }

        // Check if the user is already enrolled in the code camp
        const userCodeCamp = await UserCodeCamp.findOne({ userId, codecampId });
        if(!userCodeCamp) {
            throw new BadRequestError('Code camp not found');
        }

        const completedContents = userCodeCamp?.completedContents || [];
        const exists = userCodeCamp?.completedContents.some((el:any) => el == contentId);

        if (!exists) {
            completedContents.push(contentId);
        } else {
            const index = completedContents.indexOf(contentId);
            if (index !== -1) {
                completedContents.splice(index, 1);
            }
        }

        const codeCamp = await CodeCamp.findById(codecampId);
        const totalContents = codeCamp?.codecampData?.length || 0;
        const codeCampProgress = (completedContents.length / totalContents) * 100;

        userCodeCamp.completedContents = completedContents;
        userCodeCamp.courseProgress = codeCampProgress;
        await userCodeCamp.save();

        const message = exists ? 'Content removed from completion list' : 'Content added to completion list';
        res.status(201).json({ status: true, message });

    } catch (error) {
        next(error);
    }
}