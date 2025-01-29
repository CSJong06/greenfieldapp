import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const payment = dbconn.define('payment', {
    payment_id: {
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
        model: 'course',  // Refers to the Student table
        key: 'course_id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  },{
    tableName: 'payment', 
    createdAt: 'createdAt',
    upadtedAt: 'updatedAt'
});
  
export default payment
  