import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Sprite = sequelize.define(
  "Sprite",
  {
    _id_sprite: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sprite_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rarity: {
        type: DataTypes.ENUM('common', 'rare', 'legendary'), 
        allowNull: false
    },    
    sprite_image: {
      type: DataTypes.BLOB(), 
      allowNull: true,
    },
  },
  {
    tableName: "sprites",
    timestamps: true,
  }
);