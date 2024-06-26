import { User } from "../models/users.js";
import { Course } from "../models/courses.js";
import Sequelize from "sequelize";
import { UserPath } from "../models/user-paths.js";
import { Path } from "../models/paths.js";

//Create a new Course
export const createCourse = async (req,res) => {
    try{
        const {
            _id_path,
            name,
            duration,
        } = req.body;

        const requiredFields = [
            "_id_path",
            "name",
            "duration",
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .send({ message: `Missing ${field} field` });
            }
        }

        const newCourse = await Course.create({
            _id_path,
            name,
            duration
        });

        res.status(200).send({
            message: "Course created successfully",
            course: newCourse,
        });

    }catch (error) {
        console.error("Error during course creation:", error);

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

//Get all courses
export const getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.findAll({
            where: {}
        })

        res.status(200).send({
            message: "Course created successfully",
            course: allCourses,
        });

    }catch (error) {
        console.error("Error during course retrieval:", error);

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

//Get course with id
export const getCourse = async (req, res) => {
    try{
        const _id_course = req.query._id_course;

        const course = await Course.findByPk(_id_course)

        if(!course){
            return res.status(404).send({message: "Course not found"});
        }

        res.status(200).send({
            message: "Course created successfully",
            course: course,
        });

    }catch (error) {
        console.error("Error during course retrieval:", error);

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

//Update course with id
export const updateCourse = async (req, res) => {
    try {
        const _id_course = req.query._id_course;
        const { name, duration } = req.body;

        const course = await Course.findByPk(_id_course);
        if (!course) {
            return res.status(404).send({ message: "Course not found" });
        }

        const updated = await course.update({
            name,
            duration,
        });

        if (updated) {
            return res.status(200).send({
                message: "Course updated successfully",
                course: updated,
            });
        } else {
            return res.status(400).send({
                message: "Failed to update the course"
            });
        }

    } catch (error) {
        console.error("Error during course update:", error);

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

export const getCoursesByPath = async (req, res) => {
    try{
        const name_path = req.query.name_path;

        const decodedPath = decodeURI(name_path);

        const path = await Path.findOne({
            where: { name: decodedPath }
        });

        if (!path) {
            return res.status(404).send({ message: "Path not found" });
        }

        const courses = await Course.findAll({
            where: { _id_path: path._id_path }
        })

        res.status(200).send({
            message: "Courses retrieved successfully",
            courses: courses,
        });

    } catch (error) {
        console.error("Error during course retrieval:", error);

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
}