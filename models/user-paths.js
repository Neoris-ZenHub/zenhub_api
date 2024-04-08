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
              model: Path,
              key: "_id_path"
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
    },
    {
        tableName: "user-paths",
        timestamps: true,
    }
);
