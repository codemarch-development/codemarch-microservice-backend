import { NextFunction, Request, Response } from "express";
import Course from '../model/courseSchema';
import UserCourse from '../model/userCourseSchema';
import { BadRequestError } from "../errors/bad-request-error";



// Function to enroll a user in a course
export const userCourseEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user;
        console.log(userId);
        const { courseId } = req.body;

        // Check if both user ID and course ID are provided
        if (!userId || !courseId) {
            throw new BadRequestError('Invalid credentials');
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await UserCourse.findOne({ userId, courseId });
        if (existingEnrollment) {
            throw new BadRequestError('User is already enrolled in the course');
        }

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            throw new BadRequestError('Course not found');
        }

        // Create a new UserCourse document
        const userCourses = new UserCourse({
            userId,
            courseId,
        });
        // Save the userCourse to the database
        await userCourses.save();
        res.status(201).json({status:true, message: 'User enrolled in the course' });
    } catch (error) {
        next(error);
    }
}


export const markOrUnmarkCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user;
        const { courseId, contentId } = req?.body;

        // Check if both user ID and course ID are provided
        if (!userId || !courseId || !contentId) {
            throw new BadRequestError('Invalid credentials');
        }

        // Check if the user is already enrolled in the course
        const userCourse = await UserCourse.findOne({ userId, courseId });
        if(!userCourse) {
            throw new BadRequestError('Course not found');
        }

        const completedContents = userCourse?.completedContents || [];
        const exists = userCourse?.completedContents.some((el:any) => el == contentId);

        if (!exists) {
            completedContents.push(contentId);
        } else {
            const index = completedContents.indexOf(contentId);
            if (index !== -1) {
                completedContents.splice(index, 1);
            }
        }

        const course = await Course.findById(courseId);
        const totalContents = course?.courseData?.length || 0;
        const courseProgress = (completedContents.length / totalContents) * 100;

        userCourse.completedContents = completedContents;
        userCourse.courseProgress = courseProgress;
        await userCourse.save();

        const message = exists ? 'Content removed from completion list' : 'Content added to completion list';
        res.status(201).json({ status: true, message });

    } catch (error) {
        next(error);
    }
}