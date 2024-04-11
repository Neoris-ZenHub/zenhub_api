import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Course } from "./courses.js";
import { User } from "./users.js";

export const Evidence = sequelize.define(
  "Evidence",
  {
    _id_evidence: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    _id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User, 
        key: '_id_user',
      },
    },
    _id_course: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course, 
        key: '_id_course',
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    evidence_image: {
      type: DataTypes.BLOB(), 
      allowNull: true,
    },
  },
  {
    tableName: "evidences",
    timestamps: true,
  }
);
