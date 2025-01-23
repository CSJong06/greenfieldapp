import express from 'express';
import { Op, where } from 'sequelize';
import instructor from '../models/instructor.js';
import course from '../models/course.js';
import student from '../models/student.js';
import enrollment from '../models/enrollment.js'; // Import the enrollment model
import { requireAuth } from './auth.js'; // Importing requireAuth middleware

const router = express.Router();

router.get('/courses', async (req, res) => {
    try {
        const courses = await course.findAll();
        return res.render('courses', { courses });
    } catch (error) {
        console.error('Error fetching courses', error);
    }
});

// staff info route
router.get('/staffinfo', async (req, res) => {
    try {
        // creating the object
        const instructors = await instructor.findAll();
        // renders the page with the object
        return res.render('staffinfo', {instructors})
    } catch (error) {
        console.error('Error fetching instructors', error);
    }
});

// Payment route
router.get('/payments', async (req, res) => {
    try {
        res.render('payments');
    } catch (error) {
        console.error('Error fetching payments', error);
    }
});

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const studentUser = await student.findOne({
            where: { email: req.session.user.email } 
        });
        
        return res.render('profile', { studentUser });
    } catch (error) {
        console.error('Error fetching profile', error);
    }
});

// New route for enrolling in a course
router.post('/enroll', async (req, res) => {
    const { courseId } = req.body; 
    const studentId = req.session.user.student_id; 
    try {
        await enrollment.create({
            student_id: studentId,
            course_id: courseId,
            enrollment_date: new Date(),
        });
        res.redirect('/dashboard'); // Redirect to dashboard after enrollment
    } catch (error) {
        console.error('Error enrolling in course', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/dashboard', requireAuth, async (req, res) => {
    let course_id
    try {
        const studentId = req.session.user.student_id;
        course_id = await enrollment.findAll({
            where: { student_id: studentId }, 
        });
        // console.log("ENROLLMENT::1", enrolledCourses.Enrollment.defaultValues.course_id)
        // console.log("ENROLLMENT::2", enrolledCourses.length)
        console.log("ENROLLMENT::2", course_id.student_id)

        return res.render('dashboard', { enrolledCourses });
    } catch (error) {
        console.error('Error fetching enrolled courses', error);
    }
});




export default router;
