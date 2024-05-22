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
        
        console.log(userId,codecampId)
        // Check if both user ID and course ID are provided
        if (!userId || !codecampId) {
            throw new BadRequestError('Invalid credentials');
        }
        
        // Check if the course exists
        const codeCamp = await CodeCamp.findById(codecampId);
        if (!codeCamp) {
            throw new BadRequestError('CodeCamp not found');
        }
        

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