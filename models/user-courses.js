import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Course } from "./courses.js";
import { User } from "./users.js";

export const UserCourse = sequelize.define(
    "UserCourse",
    {
        _id_user_course: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        _id_course: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: Course,
              key: "_id_course"
            }
        },
        _id_user: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            references: {
              model: User,
              key: "_id_user"
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "user-courses",
        timestamps: true,
    }
);

//Trigger for new progress on user course
UserCourse.addHook('afterUpdate', async (userCourse, options) => {
    const transaction = options.transaction || await sequelize.transaction();
    try {
        const oldProgress = userCourse.previous('progress');
        const newProgress = userCourse.progress;
        const difference = newProgress - oldProgress;

        if (difference !== 0) {
            const pointsToAdd = 1000 * (difference / 100); 
            const neorimasToAdd = 1000 * (difference / 100);

            const user = await User.findByPk(userCourse._id_user, { transaction });
            if (user) {
                user.points += pointsToAdd;
                user.neorimas += neorimasToAdd;
                await user.save({ transaction });
            }

            // Get the course to calculate the minutes
            const course = await Course.findByPk(userCourse._id_course, { transaction });
            if (course) {
                // Calculate the minutes based on the progress and the course duration
                const minutes = (course.duration * newProgress) / 100;
                await userCourse.update({ minutes }, { transaction, hooks: false });
            } else {
                throw new Error("Course not found");
            }
        }

        if (newProgress >= 100 && !userCourse.status) {
            console.log('Updating status to true');
            await userCourse.update({ status: true }, { transaction, hooks: false });
            await userCourse.reload();
        }

        if (!options.transaction) {
            await transaction.commit();
        }
    } catch (error) {
        if (!options.transaction) {
            await transaction.rollback();
        }
        console.error('Error in afterUpdate hook for UserCourse:', error);
        throw error; 
    }
});
