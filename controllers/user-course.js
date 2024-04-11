import { User } from "../models/users.js";
import { Course } from "../models/courses.js";
import { Progress } from "../models/progress.js";
import Sequelize from "sequelize";

//Get Courses from a User
export const getUserCourses = async (req, res) => {

    const _id_user = req.user._id_user;

    try{
        const courses = await User.findOne({
            where: { _id_user: _id_user },
            include: [{
                model: Course,
                attributes: ['name'], // Specify the attributes you want to include
                through: { attributes: [] },
                include: [{
                    model: Progress,
                    where: { _id_user: _id_user },
                    attributes: ['percentage'],
                    required: false,
                }],
            }]
        });

        if(!courses){
            return res.status(404).send({message: "Course not found"});
        }

        res.status(200).send({
            message: "Courses retrieved successfully",
            courses: courses.Courses.map(course => ({
                name: course.name,
                percentage: course.Progresses.length > 0 ? course.Progresses[0].percentage : 0,
            })),
        });
        
    } catch (error) {
        console.error("Error during user-path retrieval:", error);
        res.status(500).send({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
}