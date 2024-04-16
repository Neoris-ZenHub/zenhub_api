import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Course } from "./courses.js";
import { User } from "./users.js";

export const UserCourse = sequelize.define(
    "UserCourse",
    {
        _id_user_course: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        _id_user: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: User,
              key: "_id_user"
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "user-courses",
        timestamps: true,
    }
);
