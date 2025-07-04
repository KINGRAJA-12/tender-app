import { sequelize } from "../configurations/db.js";
import { DataTypes } from "sequelize";

export const Application = sequelize.define("applications", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  tenderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "tenders",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "companies",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  message: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }
}, {
  timestamps: true
});
