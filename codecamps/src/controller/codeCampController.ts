import { NextFunction, Request, Response } from "express";
import CodeCamps from "../model/codeCampSchema";
import { BadRequestError } from "../errors/bad-request-error";


// ------------------------> Course Creation Methods <----------------------- //


// Step 1: Start the course creation process [Form - 1]
export const createCodeCamp = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { formData } = req.body;
        console.log(formData);

        if(!formData) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        const {featureOne, featureTwo, featureThree} = formData ;
        // Create a new course instance
        const newCodecamp = new CodeCamps({
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
        const response = await newCodecamp.save();
        res.status(200).json({ status: true,data:response, message: 'Course Added successfully' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Step 2: Upload course content or details [Form - 2]
export const uploadCodecampSyllabus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formData, codecampId } = req.body

        // Validation Checks
        if(!formData || !codecampId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        
        // Find the course by ID
        const course = await CodeCamps.findById(codecampId);
        if (!course) {
            throw next(new BadRequestError('Codecamp not found'));
        }

        const syllabus = await CodeCamps.findByIdAndUpdate(codecampId,{
            syllabusOverview:formData
            
        })
        res.status(200).json({ status: true,data:syllabus, message: 'Codecamp syllabus successfully' });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const uploadCodecampContent = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { formData, codecampId } = req.body;
        console.log(formData,'--------',codecampId);
        console.log(formData[0].links[0]);

        if(!formData || !codecampId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        
        // Find the course by ID
        const codecamp = await CodeCamps.findById(codecampId);
        if (!codecamp) {
            throw next(new BadRequestError('Codecamp not found'));
        }

        const data = await CodeCamps.findByIdAndUpdate(codecampId,{
            codecampData:formData,
            status:'live'
        })
        
        if(data){
            res.status(200).json({ status: true, message: 'codecamp Created successfully' });
        }

    } catch (error) {
        next(error);
    }
}

// ------------------------> Course Edit Methods <----------------------- //

// Step 1: Edit the course creation process [Form - 1]
export const updateCreation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formData } = req.body
        const codecampId = req.params.id;

        console.log(formData, codecampId,'courser update')

        if(!formData || !codecampId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }

        // Find the course by ID
        const course = await CodeCamps.findById(codecampId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }
        const {featureOne, featureTwo, featureThree} = formData ;
        if(formData.selectedImage) {
            await CodeCamps.findByIdAndUpdate(codecampId,{
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
            await CodeCamps.findByIdAndUpdate(codecampId,{
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
        const course = await CodeCamps.findById(courseId);
        if (!course) {
            throw next(new BadRequestError('Course not found'));
        }

        const syllabus = await CodeCamps.findByIdAndUpdate(courseId,{
            syllabusOverview:formData
            
        })
        res.status(200).json({ status: true,data:syllabus, message: 'Course syllabus successfully' });

    } catch (error) {
        console.log(error);
        next(error);
    }
}



export const deleteCodeCamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const codeCampId = req.params.id;
        if(codeCampId) {
            // Check if the course with the given ID exists
            const codeCamp = await CodeCamps.findById(codeCampId);
            if (!codeCamp) {
                throw next(new BadRequestError('Code Camp not found'));
            }
            // Delete the course
            await CodeCamps.findByIdAndDelete(codeCampId);

            res.status(200).json({ status: true, message: 'Code Camp deleted successfully' });
        }else{
            throw next(new BadRequestError('Invalid Credentials'));
        }
    } catch (error) {
        next(error)
    }
}


export const getCodeCampById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const codeCampId = req.params.id;
        if(codeCampId) {
            // Find the course by ID
            const codeCamp = await CodeCamps.findById({_id:codeCampId});
            console.log(codeCamp);
            if (!codeCamp) {
                throw next(new BadRequestError('Codecamp not found'));
            }
            res.status(200).json({ status: true, data: codeCamp });
        } else {
            throw next(new BadRequestError('Invalid Credentials'));
        }
    } catch (error) {
        next(error);
    }
}

export const getAllCodeCamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all courses in the database
        const codeCamps = await CodeCamps.find({});
        res.status(200).json({ status: true, data: codeCamps });
    } catch (error) {
        next(error);
    }
}



export const getTestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all courses in the database
        
        const codeCamps = await CodeCamps.find({});
        res.status(200).json({ status: true, data: codeCamps});
    } catch (error:any) {
        next(error);
    }
}