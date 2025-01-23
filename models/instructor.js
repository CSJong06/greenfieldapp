import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const instructor = dbconn.define('instructor', {
  instructor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true, // Optional field
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
    tableName: 'instructor', 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default instructor;