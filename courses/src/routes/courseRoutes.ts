import express from 'express';
import authenticateUser from '../middleware/authenticateUser';
import { createCourse, deleteCourse, getCourseById, updateCourse, getAllCourses, updateCreation, uploadCourseSyllabus, updateCourseSyllabus, uploadCourseContent } from '../controller/courseController';
import { markOrUnmarkCompletion, userCourseEnrollment } from '../controller/userCourseController';


const router = express.Router();

//-------------> Course Creation Routes <----------------//

// Step 1: Start the course creation process
router.post('/start-creation', createCourse);

// Step 2: upload the course content syllabus 
router.post('/upload-syllabus', uploadCourseSyllabus);

// Step 3: Upload & Update the course content syllabus 
router.patch('/finalize-content',uploadCourseContent);

//-------------> Course Updates Routes <----------------//

// Step 1: Edit the course creation process
router.patch('/update-creation/:id', updateCreation);

// Step 2: Edit the course content syllabus
router.patch('/update-syllabus/:id', updateCourseSyllabus);

// Get all courses
router.get('/', getAllCourses);

// Get a specific course by ID
router.get('/:id', getCourseById);

// // Update a course by ID
// router.patch('/:id', updateCourse);

// Delete a course by ID
router.delete('/:id', deleteCourse);

// Enroll a course by a user
router.post('/enroll',authenticateUser,userCourseEnrollment);

// Mark or Unmark course completion by a user
router.patch('/completion/update',authenticateUser,markOrUnmarkCompletion);

export default router ;