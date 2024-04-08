import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Path = sequelize.define(
    "Path",
    {
        _id_path: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    },
    {
        tableName: "paths",
        timestamps: true,
    }
);
