import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./users.js";
import { Sprite } from "./sprites.js";

export const UserSprite = sequelize.define(
  "UserSprite",
  {
    _id_user_sprite: {
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
    _id_sprite: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: Sprite,
          key: "_id_sprite"
        }
    },
  },
  {
    tableName: "user-sprites",
    timestamps: true,
  }
);