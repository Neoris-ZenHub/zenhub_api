import { UserPath } from "../models/user-paths.js";
import { User } from "../models/users.js";
import { Path } from "../models/paths.js";
import Sequelize from "sequelize";

//Get User Paths
export const getUserPath = async (req, res) => {
    const _id_user = req.user._id_user;

    try {
        const userPaths = await UserPath.findOne({
            where: { _id_user: _id_user }
        });

        res.status(200).send({
            message: "User paths retrieved successfully",
            paths: userPaths,
        });
    } catch (error) {
        console.error("Error during user-path retrieval:", error);
        res.status(500).send({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};
