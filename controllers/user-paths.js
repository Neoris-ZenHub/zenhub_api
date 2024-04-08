import { UserPath } from "../models/user-paths.js";
import Sequelize from "sequelize";

//Get Paths of a User
export const getUserPath = async (req, res) => {
    const _id_user = req.user._id_user;

    try{
        const userPaths = await UserPath.findAll({
            where: {
                _id_user: _id_user
            }
        })

        res.status(200).send({
            message: "User paths retrieved successfully",
            paths: userPaths,
        });

    } catch (error) {
        console.error("Error during user-path retrieval:", error);

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