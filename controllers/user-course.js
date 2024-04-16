import { User } from "../models/users.js";
import { Course } from "../models/courses.js";
import Sequelize from "sequelize";

//Get Courses from a User
export const getUserCourses = async (req, res) => {
    const _id_user = req.user._id_user;

    try {
        const user = await User.findOne({
            where: { _id_user: _id_user },
            include: [{
                model: Course,
                attributes: ['name'],
                through: {
                    attributes: ['progress'],  
                }
            }]
        });

        if (!user || !user.Courses) {
            return res.status(404).send({message: "Courses not found for the user"});
        }

        res.status(200).send({
            message: "Courses retrieved successfully",
            courses: user.Courses.map(course => ({
                name: course.name,
                percentage: course.UserCourse.progress  
            })),
        });
        
    } catch (error) {
        console.error("Error retrieving user courses:", error);
        res.status(500).send({
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};
