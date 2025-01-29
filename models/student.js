import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const student = dbconn.define('student', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
  },
  date_of_birth: {
    type: DataTypes.DATE,
  },
  address: {
    type: DataTypes.STRING(75),
    allowNull: false,
  },
  s_status: {
    type: DataTypes.ENUM('active', 'graduated', 'inactive'),
    defaultValue: 'active',
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
},{
    tableName: 'student', 
    createdAt: 'enrollment_date',
    updatedAt: 'updatedAt'
});

export default student;
