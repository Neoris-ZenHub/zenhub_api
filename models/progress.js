import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./users.js";
import { Course } from "./courses.js";

export const Progress = sequelize.define(
    "Progress",
    {
        _id_progress: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        _id_user: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: User,
              key: "_id_user"
            }
        },
        _id_course: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: Course,
              key: "_id_course"
            }
        },
        percentage: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
    },
    {
        tableName: "progress",
        timestamps: true,
    }
);
