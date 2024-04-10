import { UserPath } from "../models/user-paths.js";
import { User } from "../models/users.js";
import { Path } from "../models/paths.js";
import Sequelize from "sequelize";

//Get User Paths
export const getUserPath = async (req, res) => {
    const _id_user = req.user._id_user;

    try {
        const userPath = await User.findOne({
            where: { _id_user: _id_user },
            include: [{
                model: Path,
                attributes: ['name'], // Specify the attributes you want to include
            }]
        });

        if (!userPath) {
            res.status(404).send({
                message: "User paths not found",
            });
            return;
        }

        const pathNames = userPath.Paths.map(path => path.name); // Extract only the name of each path

        res.status(200).send({
            message: "User paths retrieved successfully",
            path: pathNames
        });
    } catch (error) {
        console.error("Error during user-path retrieval:", error);
        res.status(500).send({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};
