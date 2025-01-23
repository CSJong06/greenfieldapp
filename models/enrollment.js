import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const enrollment = dbconn.define('enrollment', {
    enrollment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',  // Refers to the Student table
        key: 'student_id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',  // Refers to the Course table
        key: 'course_id',
      },
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    progress: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    grade: {
      type: DataTypes.STRING(10),
    },
  },{
    tableName: 'enrollment', 
    createdAt: 'createdAt',
    upadtedAt: 'updatedAt'
});
  
export default enrollment;
  