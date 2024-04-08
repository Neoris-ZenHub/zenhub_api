import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Path } from "./paths.js";

export const Course = sequelize.define(
    "Course",
    {
        _id_course: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        _id_path: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: Path,
              key: "_id_path"
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "courses",
        timestamps: true,
    }
);
