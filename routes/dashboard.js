import express from 'express';
import { Op, where } from 'sequelize';
import instructor from '../models/instructor.js';
import course from '../models/course.js';
import student from '../models/student.js';
import { requireAuth } from './auth.js'; // Importing requireAuth middleware

const router = express.Router();

router.get('/courses', async (req, res) => {
    try {
        // creating the object
        const courses = await course.findAll();
        // renders the page with the object
        return res.render('courses', {courses})
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

export default router;
