dotenv.config();
import dotenv from "dotenv";
import Sequelize from "sequelize";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

//Sign Up
export const createUser = async (req,res) => {
    try {
        const {
            name,
            last_name,
            username,
            password,
            email
        } = req.body;

        const requiredFields = [
            "name",
            "last_name",
            "username",
            "password",
            "email"
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .send({ message: `Missing ${field} field` });
            }
        }

        const [userCreated, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name,
                last_name,
                username,
                password,
                email
            },
        });

        if (!created) {
            return res.status(403).send({ message: "Email already in use" });
        }
        
        const userData = userCreated.get({ plain: true });
        delete userData.password_token;

        const token = jwt.sign(
            { _id_user: userCreated._id_user },
            process.env.TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            message: "User created successfully",
            user: userData,
            token,
        });

    } catch (error) {
        console.error("Error during user creation:", error);

        if (error instanceof Sequelize.ValidationError) {
            return res
                .status(400)
                .send({ message: "Validation error", errors: error.errors });
        } else {
            return res.status(500).send({
                message: "An unexpected error occurred",
                error: error.message,
            });
        }
    }
};

//Sing In
export const logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email,
                is_valid: true,
            },
        });

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { _id_user: user._id_user },
            process.env.TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            message: "Login successful.",
            token,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
