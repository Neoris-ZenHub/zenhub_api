import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
    "User",
    {
        _id_user: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("consumer", "admin"),
            allowNull: false,
            defaultValue: "consumer",
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        neorimas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        paranoid: true
    }
);

//Trigger for not repeating usernames
User.beforeUpdate(async (user, options) => {
    if (user.changed('username')) {
        const existingUser = await User.findOne({
            where: {
                username: user.username,
                _id_user: { [DataTypes.Op.ne]: user._id_user }  
            }
        });
        if (existingUser) {
            throw new Error('Username is already in use.');
        }
    }
});
