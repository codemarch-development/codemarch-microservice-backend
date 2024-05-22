import express from 'express';;
import authenticateUser from '../middleware/authenticateUser';
import { getTestConfirmation, createCodeCamp, deleteCodeCamps, getAllCodeCamps, getCodeCampById, updateCreation, uploadCodecampContent } from '../controller/codeCampController'
import { userCodeCampEnrollment } from '../controller/userCodecampController';


const router = express.Router();


//-------------> Codecamp Creation Routes <----------------//

// Step 1: Start the CODECAMP creation process
router.post('/start-creation', createCodeCamp);

// Step 2: upload the CODECAMP content syllabus 
// router.post('/upload-syllabus', uploadCodecampSyllabus);

// Step 3: Upload & Update the CODECAMP content syllabus 
router.patch('/finalize-content',uploadCodecampContent);

//-------------> CODECAMP Updates Routes <----------------//

// Step 1: Edit the CODECAMP creation process
router.patch('/update-creation/:id', updateCreation);

// Step 2: Edit the CODECAMP content syllabus
// router.patch('/update-syllabus/:id', updateCourseSyllabus);


// Get all code camps
router.get('/', getAllCodeCamps);

// Delete a code camp by ID
router.delete('/:id', deleteCodeCamps);

// Get a specific code camp by ID
router.get('/:id', getCodeCampById);

// Get a specific codecamp content by IDs
// router.get('/:id/content/:contentId', getCodecampContentByIds);

// Enroll a code camp by a user
router.post('/enroll',authenticateUser,userCodeCampEnrollment);


export default router ;