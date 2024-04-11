import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Path } from "./paths.js";
import { User } from "./users.js";

export const UserPath = sequelize.define(
    "UserPath",
    {
        _id_user_path: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        _id_path: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: "paths",
              key: "_id_path"
            }
        },
        _id_user: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: "users",
              key: "_id_user"
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        tableName: "user-paths",
        timestamps: true,
    }
);
