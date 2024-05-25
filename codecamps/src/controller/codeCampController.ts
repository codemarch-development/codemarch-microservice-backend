import { NextFunction, Request, Response } from "express";
import { PublishMessage, getPayload } from "../utils";  
import { PublishMessage, getPayload } from "../utils";  
import CodeCamps from "../model/codeCampSchema";
import { BadRequestError } from "../errors/bad-request-error";
import { config } from "../configs/envConfiguration";
import mongoose from "mongoose";
import { config } from "../configs/envConfiguration";
import mongoose from "mongoose";


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
// export const uploadCodecampSyllabus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { formData, codecampId } = req.body
// export const uploadCodecampSyllabus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { formData, codecampId } = req.body

//         // Validation Checks
//         if(!formData || !codecampId) {
//             throw next(new BadRequestError('Invalid Credentials'));
//         }
//         // Validation Checks
//         if(!formData || !codecampId) {
//             throw next(new BadRequestError('Invalid Credentials'));
//         }
        
//         // Find the course by ID
//         const course = await CodeCamps.findById(codecampId);
//         if (!course) {
//             throw next(new BadRequestError('Codecamp not found'));
//         }
//         // Find the course by ID
//         const course = await CodeCamps.findById(codecampId);
//         if (!course) {
//             throw next(new BadRequestError('Codecamp not found'));
//         }

//         const syllabus = await CodeCamps.findByIdAndUpdate(codecampId,{
//             syllabusOverview:formData
//         const syllabus = await CodeCamps.findByIdAndUpdate(codecampId,{
//             syllabusOverview:formData
            
//         })
//         res.status(200).json({ status: true,data:syllabus, message: 'Codecamp syllabus successfully' });
//         })
//         res.status(200).json({ status: true,data:syllabus, message: 'Codecamp syllabus successfully' });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }

export const uploadCodecampContent = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { formData, codecampId } = req.body;
        const { rabbitMQChannel } : any = global;
        const { rabbitMQChannel } : any = global;
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
            codecamp_data:formData,
            codecamp_data:formData,
            status:'live'
        })

        if(codecamp.status === 'live') {
            const payload = getPayload(data,'CODECAMP_UPDATED')
            
            if (rabbitMQChannel) {
                await PublishMessage(rabbitMQChannel, config.CUSTOMER_BINDING_KEY, JSON.stringify(payload));
            } else {
                console.error('Channel is undefined. Unable to publish message.');
            }
        }

        if(codecamp.status === 'live') {
            const payload = getPayload(data,'CODECAMP_UPDATED')
            
            if (rabbitMQChannel) {
                await PublishMessage(rabbitMQChannel, config.CUSTOMER_BINDING_KEY, JSON.stringify(payload));
            } else {
                console.error('Channel is undefined. Unable to publish message.');
            }
        }
        
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


// export const updateCourseSyllabus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { formData } = req.body;
//         const courseId = req.params.id;
//         console.log(formData,'formData')
//         console.log(courseId,'courseId');

// export const updateCourseSyllabus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { formData } = req.body;
//         const courseId = req.params.id;
//         console.log(formData,'formData')
//         console.log(courseId,'courseId');

//         // Validation Checks
//         if(!formData || !courseId) {
//             throw next(new BadRequestError('Invalid Credentials'));
//         }
//         // Validation Checks
//         if(!formData || !courseId) {
//             throw next(new BadRequestError('Invalid Credentials'));
//         }
        
//         // Find the course by ID
//         const course = await CodeCamps.findById(courseId);
//         if (!course) {
//             throw next(new BadRequestError('Course not found'));
//         }
//         // Find the course by ID
//         const course = await CodeCamps.findById(courseId);
//         if (!course) {
//             throw next(new BadRequestError('Course not found'));
//         }

//         const syllabus = await CodeCamps.findByIdAndUpdate(courseId,{
//             syllabusOverview:formData
//         const syllabus = await CodeCamps.findByIdAndUpdate(courseId,{
//             syllabusOverview:formData
            
//         })
//         res.status(200).json({ status: true,data:syllabus, message: 'Course syllabus successfully' });
//         })
//         res.status(200).json({ status: true,data:syllabus, message: 'Course syllabus successfully' });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }



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
        const codecampId = req.params.id;
        if(codecampId) {
        const codecampId = req.params.id;
        if(codecampId) {
            // Find the course by ID
            const codecamp = await CodeCamps.findById({_id:codecampId});
            console.log(codecamp);
            if (!codecamp) {
            const codecamp = await CodeCamps.findById({_id:codecampId});
            console.log(codecamp);
            if (!codecamp) {
                throw next(new BadRequestError('Codecamp not found'));
            }
            res.status(200).json({ status: true, data: codecamp });
            res.status(200).json({ status: true, data: codecamp });
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
        const codecamps = await CodeCamps.find({});
        res.status(200).json({ status: true, data: codecamps });
    } catch (error) {
        next(error);
    }
}


export const getCodecampContentByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const codecampId = req.params.id;
        const contentId = req.params.contentId;
        console.log(contentId, 'contentId')

        // Validation Checks
        if (!codecampId || !contentId) {
            throw next(new BadRequestError('Invalid Credentials'));
        }
        // Convert contentId to ObjectId
        const contentObjectId = new mongoose.Types.ObjectId(contentId);

        const codecamp = await CodeCamps.findById({ _id: codecampId });
        if (codecamp) {
            // Find the content by contentId
            const contentIndex = codecamp.codecamp_data.findIndex(content => content._id.equals(contentObjectId));
            if (contentIndex !== -1) {
                const content = codecamp.codecamp_data[contentIndex];

                res.status(200).json({
                    status: true,
                    data: content,
                    prevContentId: contentIndex > 0 ? codecamp.codecamp_data[contentIndex - 1]._id : null,
                    nextContentId: contentIndex < codecamp.codecamp_data.length - 1 ? codecamp.codecamp_data[contentIndex + 1]._id : null
                });

            } else {
                
                throw next(new BadRequestError('Content not found'));
            }
        } else {
            throw next(new BadRequestError('Codecamp not found'));
        }

    } catch (error) {
        next(error);
    }
}


// export const getCodecampContentByIds = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const codecampId = req.params.id;
//         const contentId  = req.params.contentId;
//         console.log(contentId,'contentId')

//         // Validation Checks
//         if(!codecampId || !contentId) {
//             throw next(new BadRequestError('Invalid Credentials'));
//         }
//         // Convert contentId to ObjectId
//         const contentObjectId = new mongoose.Types.ObjectId(contentId);

//         const codecamp = await CodeCamps.findById({ _id: codecampId });
//         if (codecamp) {
//             // Find the content by contentId
//             const content = codecamp.codecamp_data.find(content => content._id.equals(contentObjectId));
//             if (content !== undefined) {

//                 console.log(content, 'Found content');
//                 res.status(200).json({ status: true, data: content });

//             } else {
//                 console.log('content not found',content)
//                 throw next(new BadRequestError('Content not found'));
//             }
//         } else {
//             throw next(new BadRequestError('Codecamp not found'));
//         }

//     } catch (error) {
//         next(error);
//     }
// }



export const getTestConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find all courses in the database
        
        const codeCamps = await CodeCamps.find({});
        res.status(200).json({ status: true, data: codeCamps});
    } catch (error:any) {
        next(error);
    }
}


// Serve RPC requests
export const serveRPCRequests = (payload:any) => {
     
    const { type, data, userId } = JSON.parse(payload) ;
    console.log(event,'----')
    try {
        switch(type){
            case 'CODECAMP_ENROLLED':
                console.log('set ayeda mowne')
                break;
            default:
                break;
        }
        
    } catch (error) {
        throw(error)
    }

}


// Serve RPC requests
export const serveRPCRequests = (payload:any) => {
     
    const { type, data, userId } = JSON.parse(payload) ;
    console.log(event,'----')
    try {
        switch(type){
            case 'CODECAMP_ENROLLED':
                console.log('set ayeda mowne')
                break;
            default:
                break;
        }
        
    } catch (error) {
        throw(error)
    }

}