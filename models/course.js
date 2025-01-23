import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const course = dbconn.define('Course', {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    c_description: {
      type: DataTypes.TEXT,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instructor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'instructor',  // Refers to the Instructor table
        key: 'instructor_id',
      },
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
},{
    tableName: 'course', 
    createdAt: 'createdAt',
    upadtedAt: 'updatedAt'
});
  
export default course;
  