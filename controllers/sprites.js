import { Sprite } from "../models/sprites.js";
import { User } from "../models/users.js";
import { UserSprite } from "../models/user-sprites.js";
import { sequelize } from "../config/db.js";
import Sequelize, { where } from "sequelize";
import { request } from "express";

// Get 6 random sprites
export const getRandomSprites = async (req, res) => {
    try {
        const randomSprites = await Sprite.findAll({
            order: Sequelize.literal('RANDOM()'),
            limit: 6,
            attributes: ['_id_sprite', 'name', 'price', 'rarity','sprite_image' ]
        });

        res.status(200).send({
            message: "Random sprites retrieved successfully",
            sprites: randomSprites,
        });
    } catch (error) {
        console.error("Error during random sprite retrieval:", error);

        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).send({ message: "Validation error", errors: error.errors });
        } else {
            return res.status(500).send({
                message: "An unexpected error occurred",
                error: error.message,
            });
        }
    }
};

//Buy a sprite from the marketplace
export const buySprite = async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const _id_user = req.user._id_user;
        const { _id_sprite } = req.body;

        const userBuying = await User.findByPk(_id_user);
        if (!userBuying) {
            await transaction.rollback();
            return res.status(404).send({ message: "User not found" });
        }

        const spriteBought = await Sprite.findByPk(_id_sprite);
        if (!spriteBought) {
            await transaction.rollback();
            return res.status(404).send({ message: "Sprite not found" });
        }

        const existingUserSprite = await UserSprite.findOne({
            where: {
                _id_user,
                _id_sprite,
            }
        });

        if (existingUserSprite) {
            await transaction.rollback();
            console.log("Sprite already bought")
            return res.status(403).send({ message: "Sprite already bought" });
        }

        const userNeorimas = userBuying.neorimas;
        const spritePrice = spriteBought.price;
        if (spritePrice > userNeorimas) {
            await transaction.rollback();
            console.log("Insufficient neorimas to complete purchase")
            return res.status(403).send({ message: "Insufficient neorimas to complete purchase" });
        }

        userBuying.neorimas -= spritePrice;
        await userBuying.save({ transaction });

        const userNewSprite = await UserSprite.create({
            _id_user,
            _id_sprite,
        }, { transaction });

        await transaction.commit();
        res.status(200).send({
            message: "Sprite bought successfully",
            sprite: userNewSprite,
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error during sprite sale retrieval:", error);

        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).send({ message: "Validation error", errors: error.errors });
        } else {
            return res.status(500).send({
                message: "An unexpected error occurred",
                error: error.message,
            });
        }
    }
};

// Get User Sprites for videogame
export const getUserSprites = async (req, res) => {
    try {
        const _id_user = req.user._id_user; 

        const userSprites = await User.findOne({
            where: { _id_user: _id_user },
            include: [{
                model: Sprite,
                attributes: ['name', 'sprite_url'],
                through: {
                    attributes: [], 
                }
            }]
        });

        if (userSprites) {
            return res.status(200).send({
                message: "Sprites retrieved successfully",
                sprites: userSprites.Sprites 
            });
        } else {
            return res.status(404).send({
                message: "User not found or has no sprites",
            });
        }
    } catch (error) {
        console.error("Error during user sprite retrieval:", error);
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).send({
                message: "Validation error",
                errors: error.errors
            });
        } else {
            return res.status(500).send({
                message: "An unexpected error occurred",
                error: error.message
            });
        }
    }
};
