import { NextFunction, Request, Response } from "express";
import Course from '../model/courseSchema';
import { BadRequestError } from "../errors/bad-request-error";


// ------------------------> Course Creation Methods <----------------------- //

// Step 1: Start the course creation process [Form - 1]
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { formData } = req.body;
        console.log(formData);

        if(!formData) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        const {featureOne, featureTwo, featureThree} = formData ;
        // Create a new course instance
        const newCourse = new Course({
            title: formData.title,
            description: formData.description,
            benefits: [featureOne, featureTwo, featureThree],
            about: formData.about,
            thumbnail: formData.selectedImage,
            price:formData.price,
            estimatedPrice: formData.estimated,
            tags: formData.tags,
            status:'pending'
            // Other properties from your formData
        });
    
        // Save the course to the database
        const response = await newCourse.save();
        res.status(200).json({ status: true,data:response, message: 'Course Added successfully' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


// Step 2: Upload course content or details [Form - 2]
export const uploadCourseSyllabus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formData, courseId } = req.body

        // Validation Checks
        if(!formData || !courseId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }

        const syllabus = await Course.findByIdAndUpdate(courseId,{
            syllabusOverview:formData
            
        })
        res.status(200).json({ status: true,data:syllabus, message: 'Course syllabus successfully' });

    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const uploadCourseContent = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { formData, courseId } = req.body;
        console.log(formData,'--------',courseId);
        console.log(formData[0].links[0]);

        if(!formData || !courseId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }

        const data = await Course.findByIdAndUpdate(courseId,{
            courseData:formData,
            status:'live'
        })

        res.status(200).json({ status: true, message: 'Course Created successfully' });

    } catch (error) {
        next(error);
    }
}

// ------------------------> Course Edit Methods <----------------------- //

// Step 1: Edit the course creation process [Form - 1]
export const updateCreation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formData } = req.body
        const courseId = req.params.id;

        console.log(formData, courseId,'courser update')

        if(!formData || !courseId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }

        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }
        const {featureOne, featureTwo, featureThree} = formData ;
        if(formData.selectedImage) {
            await Course.findByIdAndUpdate(courseId,{
                title: formData.title,
                description: formData.description,
                benefits: [featureOne, featureTwo, featureThree],
                about: formData.about,
                thumbnail: formData.selectedImage,
                price:formData.price,
                estimatedPrice: formData.estimated,
                tags: formData.tags,
            })
            res.status(200).json({ status: true, message: 'Course updated successfully' });
        } else {
            await Course.findByIdAndUpdate(courseId,{
                title: formData.title,
                description: formData.description,
                benefits: [featureOne, featureTwo, featureThree],
                about: formData.about,
                price:formData.price,
                estimatedPrice: formData.estimated,
                tags: formData.tags,
            })
            res.status(200).json({ status: true, message: 'Course updated successfully' });
        }

    } catch (error) {
        next(error);
    }
}

export const updateCourseSyllabus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formData } = req.body;
        const courseId = req.params.id;
        console.log(formData,'formData')
        console.log(courseId,'courseId');

        // Validation Checks
        if(!formData || !courseId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }

        const syllabus = await Course.findByIdAndUpdate(courseId,{
            syllabusOverview:formData
            
        })
        res.status(200).json({ status: true,data:syllabus, message: 'Course syllabus successfully' });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courseId = req.params.id;
        const courseData = req.body;

        if(!courseData || !courseId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }

        // Update & Save course data (modify this based on your schema structure)
        course.set(courseData);
        await course.save();
        res.status(200).json({ status: true, message: 'Course updated successfully' });
    } catch (error) {
        next(error);
    }
}


export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        if(courseId) {
            // Check if the course with the given ID exists
            const course = await Course.findById(courseId);
            if (!course) {
                throw next(new BadRequestError('Course not found'));
            }
            // Delete the course
            await Course.findByIdAndDelete(courseId);

            res.status(200).json({ status: true, message: 'Course deleted successfully' });
        }else{
            throw next(new BadRequestError('Invalid Credentials'));
        }
    } catch (error) {
        next(error)
    }
}


export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        if(courseId) {
            // Find the course by ID
            const course = await Course.findById({_id:courseId});
            if (!course) {
                throw next(new BadRequestError('Course not found'));
            }
            res.status(200).json({ status: true, data: course });
        } else {
            throw next(new BadRequestError('Invalid Credentials'));
        }
    } catch (error) {
        next(error);
    }
}

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all courses in the database
        const courses = await Course.find({});
        console.log(courses);
        res.status(200).json({ status: true, data: courses });
    } catch (error) {
        next(error);
    }
}