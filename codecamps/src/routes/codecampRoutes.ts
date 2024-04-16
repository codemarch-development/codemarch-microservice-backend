import express from 'express';;
import authenticateUser from '../middleware/authenticateUser';
import { getTestConfirmation, createCodeCamp, deleteCodeCamps, getAllCodeCamps, getCodeCampById, updateCourseSyllabus, updateCreation, uploadCodecampContent, uploadCodecampSyllabus } from '../controller/codeCampController'
import { markOrUnmarkCompletion, userCodeCampEnrollment } from '../controller/userCodecampController';


const router = express.Router();


//-------------> Codecamp Creation Routes <----------------//

// Step 1: Start the CODECAMP creation process
router.post('/start-creation', createCodeCamp);

// Step 2: upload the CODECAMP content syllabus 
router.post('/upload-syllabus', uploadCodecampSyllabus);

// Step 3: Upload & Update the CODECAMP content syllabus 
router.patch('/finalize-content',uploadCodecampContent);

//-------------> CODECAMP Updates Routes <----------------//

// Step 1: Edit the CODECAMP creation process
router.patch('/update-creation/:id', updateCreation);

// Step 2: Edit the CODECAMP content syllabus
router.patch('/update-syllabus/:id', updateCourseSyllabus);


// Get all code camps
router.get('/', getAllCodeCamps);

// Get a specific code camp by ID

// // Update a code camp by ID
// router.patch('/:id', updateCodeCamps);

router.get('/anshid',getTestConfirmation)
// User Codecamps
// router.get('/user/codecamps',authenticateUser,myCodecamps);

// Delete a code camp by ID
router.delete('/:id', deleteCodeCamps);

router.get('/:id', getCodeCampById);

// Enroll a code camp by a user
router.post('/enroll',userCodeCampEnrollment);

// Mark or Unmark code camp completion by a user


export default router ;