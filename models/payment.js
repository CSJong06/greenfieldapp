import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const payment = dbconn.define('Payment', {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',  // Refers to the Student table
        key: 'student_id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('credit card', 'bank transfer', 'cash', 'other'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('completed', 'pending', 'failed'),
      allowNull: false,
    },
  },{
    tableName: 'payment', 
    createdAt: 'createdAt',
    upadtedAt: 'updatedAt'
});
  
export default payment
  