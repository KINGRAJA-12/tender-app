import { sequelize } from "../configurations/db.js";
import { DataTypes } from "sequelize";
export const Tender = sequelize.define("tenders", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "open"
  },
  tenderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "companies",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  allocatedTo: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    references: {
      model: "companies",
      key: "id"
    },
    onDelete: "CASCADE"
  }
}, {
  timestamps: true
});
