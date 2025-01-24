import course from "../models/course.js"
import enrollment from "../models/enrollment.js"
import instructor from "./instructor.js"
import payment from "../models/payment.js"
import student from "../models/student.js"

// 1. Student ↔ Payment (One-to-Many)
student.hasMany(payment, {
    foreignKey: 'student_id',
    as: 'payments', // Alias for the relationship
    onDelete: 'CASCADE',
  });
  payment.belongsTo(student, {
    foreignKey: 'student_id',
    as: 'student',
  });
  
  // 2. Instructor ↔ Course (One-to-Many)
  instructor.hasMany(course, {
    foreignKey: 'instructor_id',
    as: 'courses',
    onDelete: 'CASCADE',
  });
  course.belongsTo(instructor, {
    foreignKey: 'instructor_id',
    as: 'instructor',
  });
  
  // 3. Student ↔ Enrollment (One-to-Many)
  student.hasMany(enrollment, {
    foreignKey: 'student_id',
    as: 'enrollments',
    onDelete: 'CASCADE',
  });
  enrollment.belongsTo(student, {
    foreignKey: 'student_id',
    as: 'student',
  });
  
  // 4. Course ↔ Enrollment (One-to-Many)
  course.hasMany(enrollment, {
    foreignKey: 'course_id',
    as: 'enrollments',
    onDelete: 'CASCADE',
  });
  enrollment.belongsTo(course, {
    foreignKey: 'course_id',
    as: 'course',
  });
  
  
// 5. Enrollment ↔ Student ↔ Course (Many-to-Many through Enrollment)

// 6. Course ↔ Payment (One-to-Many)
course.hasMany(payment, {
    foreignKey: 'course_id',
    as: 'payments', // Alias for the relationship
    onDelete: 'CASCADE',
});
payment.belongsTo(course, {
    foreignKey: 'course_id',
    as: 'course',
});

  student.belongsToMany(course, {
    through: enrollment, // Join table
    foreignKey: 'student_id',
    otherKey: 'course_id',
    as: 'enrolledCourses',
  });
  course.belongsToMany(student, {
    through: enrollment, // Join table
    foreignKey: 'course_id',
    otherKey: 'student_id',
    as: 'studentsEnrolled',
  });
