import { sequelize } from "../configurations/db.js";
import { DataTypes } from "sequelize";

export const Service = sequelize.define("services", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  companyInfo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "companies",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});
