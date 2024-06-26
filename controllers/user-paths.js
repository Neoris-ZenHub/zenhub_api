import { UserPath } from "../models/user-paths.js";
import { UserCourse } from "../models/user-courses.js";
import { User } from "../models/users.js";
import { Course } from "../models/courses.js";
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
                attributes: ['name'], 
            }]
        });

        if (!userPath) {
            res.status(404).send({
                message: "User paths not found",
            });
            return;
        }

        const pathNames = userPath.Paths.map(path => path.name);

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

//Create User Path
export const createUserPath = async (req, res) => {
    const _id_user = req.user._id_user;
    const { pathName } = req.body;

    try {
        const path = await Path.findOne({
            where: {
                name: pathName
            }
        });

        if (!path) {
            return res.status(404).send({
                message: "Path not found",
            });
        }

        const existingUserPath = await UserPath.findOne({
            where: {
                _id_user: _id_user
            }
        });

        if (existingUserPath) {
            return res.status(409).send({
                message: "User already has an assigned path",
            });
        }

        const userPathCreated = await UserPath.create({
            _id_user,
            _id_path: path._id_path,
        });

        const courses = await Course.findAll({
            where: {
                _id_path: path._id_path
            }
        });

        const userCourses = await Promise.all(courses.map(course => 
            UserCourse.create({
                _id_user: _id_user,
                _id_course: course._id_course
            })
        ));

        res.status(201).send({
            message: "User path and courses assigned successfully",
            userPath: userPathCreated,
            userCourses: userCourses
        });

    } catch ( error ) {
        console.error("Error during user-path creation:", error);
        res.status(500).send({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};
