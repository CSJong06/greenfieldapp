import express from 'express';
import { Op, where } from 'sequelize';
import instructor from '../models/instructor.js';
import course from '../models/course.js';
import student from '../models/student.js';
import enrollment from '../models/enrollment.js'; // Import the enrollment model
import { requireAuth } from './auth.js'; // Importing requireAuth middleware
import payment from '../models/payment.js'; // Importing payment model

const router = express.Router();

// get all the courses and render them onto the page
router.get('/courses', requireAuth, async (req, res) => {
    try {
        const courses = await course.findAll();
        return res.render('courses', { courses });
    } catch (error) {
        console.error('Error fetching courses', error);
    }
});

// get all the courses and render them onto the page
router.get('/staffinfo', requireAuth, async (req, res) => {
    try {
        const instructors = await instructor.findAll();
        return res.render('staffinfo', {instructors})
    } catch (error) {
        console.error('Error fetching instructors', error);
    }
});

// gets all the data for the profile based on the session email
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

// Enrolling in a course
router.post('/enroll', async (req, res) => {
    const { courseId } = req.body; //selected course
    const studentId = req.session.user.student_id; 
    try {
        await enrollment.create({
            student_id: studentId,
            course_id: courseId,
            enrollment_date: new Date(),
        });
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error('Error enrolling in course', error);
        res.status(500).send('Internal Server Error');
    }
});

// Dashboard routes
router.get('/dashboard', requireAuth, async (req, res) => {
    try {

        const studentUser = req.session.user.student_id;

        // finds the enrollment data for the student
        const enrollmentTable = await enrollment.findAll({ where: { student_id: studentUser } });
        
        // Fetching course details for each enrollment
        const enrolledCourses = await Promise.all(enrollmentTable.map(async (enrollment) => {
            const courseDetails = await course.findOne({ where: { course_id: enrollment.course_id } });
            return {
                course: courseDetails,
                grade: enrollment.grade
            };
        }));
    
        return res.render('dashboard', { enrolledCourses });
    } catch (error) {
        console.error('Error fetching enrolled courses', error);
    }
});

// Payment route
router.get('/payments', requireAuth, async (req, res) => {
    try {

        const studentUser = req.session.user.student_id;

        // finds the students data for the student
        const studentTable = await student.findOne({ where: { student_id: studentUser } });
        
        // Fetch enrolled courses
        const enrollmentTable = await enrollment.findAll({ where: { student_id: studentUser } });
        const enrolledCourses = await Promise.all(enrollmentTable.map(async (enrollment) => {
            const courseDetails = await course.findOne({ where: { course_id: enrollment.course_id } });
            return {
                course: courseDetails,
            };
        }));

        //finds the table associated with the student
        const paymentTable = await payment.findAll({where: {student_id: studentUser}});
        //grabs the ids of the paid for courses
        const paidCourseIDs = paymentTable.map(payment => payment.course_id);
        //finds the data for the courses that are paid for
        const paidCourses = await course.findAll({where: {course_id: paidCourseIDs}});
        
        // Retrieve payment dates
        const paymentDates = paymentTable.map(payment => payment.createdAt);

        res.render('payments', { enrolledCourses, studentTable, paidCourses, paymentDates });
    } catch (error) {
        console.error('Error fetching payments', error);
    }
});

// updating balance in the database
router.post("/balance", requireAuth, async (req, res) => {
    try {

        const studentUser = req.session.user.student_id;
        const studentTable = await student.findOne({ where: { student_id: studentUser } });
        // grabs the users balance from the database
        const currentBalance = parseFloat(studentTable.balance)

        // initializes a temporary balance
        let studentBalance;

        // amount inputted by the user
        const {paymentAmount} = req.body;

        //if the amount is more than 0 updated the balance in the database
        if(paymentAmount > 0){
            studentBalance = currentBalance + parseFloat(paymentAmount); 
            await student.update({ balance: studentBalance }, { where: { student_id: studentUser } });
        }
        else{
            req.flash("error", "Invalid payment amount");
        }
        
        res.redirect("/payments")
    } catch (error) {
        console.error(error)
    }
});

// creating payments in the database
router.post("/pay", requireAuth, async (req, res) => {
    try {
        const studentUser = req.session.user.student_id;
        const studentTable = await student.findOne({ where: { student_id: studentUser } });
        const currentBalance = parseFloat(studentTable.balance);
        

        const selectedCourse = req.body.courseId; 
        //finds course derails based on the selected id
        const courseDetails = await course.findOne({ where: { course_id: selectedCourse } });
        
        // gets the course price
        const coursePrice = courseDetails.price;

        //  flashes error if the balance is not enough
        if (currentBalance < coursePrice) {
            req.flash("error", "Insufficient Funds");
        } else {
            await payment.create({
                student_id: studentUser,
                course_id: selectedCourse,
                amount: coursePrice
            });
            await student.update({ balance: currentBalance - coursePrice }, { where: { student_id: studentUser } });
        }
        
        res.redirect("/payments");
    } catch (error) {
        console.error(error);
    }
});

export default router;
