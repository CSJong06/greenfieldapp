import { DataTypes } from "sequelize";
import dbconn from "../config/dbconn.js";

const report = dbconn.define('Report', {
    report_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    generated_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_students: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_enrollments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
  },{
    tableName: 'report', 
    createdAt: 'createdAt',
    upadtedAt: 'updatedAt'
});
  
export default report
  