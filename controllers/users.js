dotenv.config();
import dotenv from "dotenv";
import Sequelize from "sequelize";
import sequelize from "sequelize";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import { Path } from "../models/paths.js";
import { Course } from "../models/courses.js";
import { UserCourse } from "../models/user-courses.js";
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
                deletedAt: null,
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

//Get User
export const getUser = async (req, res) => {
    const _id_user = req.user._id_user;
    
    try {
        const user = await User.findByPk(_id_user)

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send(user);
    

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

//Get Ranking for dashboard
export const getRankings = async (req, res) => {
    try {
        const { sortField, orderField, userSearch } = req.query; // sort field --> global or path name
                                                    // order field --> neorimas or puntos

        const decodedSortField = decodeURIComponent(sortField);
        const decodedOrderField = decodeURIComponent(orderField);
        const decodedUserSearch = decodeURIComponent(userSearch);

        let whereClause = {};
        let orderClause = [['points', 'DESC']];  
        let pathWhereClause = {}; 

        switch (decodedSortField) {
            case 'Global':
                orderClause = [['points', 'DESC']];
                break;
            default:
                pathWhereClause.name = decodedSortField;  
                break;
        }

        switch(decodedOrderField){
            case 'Neorimas':
                orderClause = [['neorimas','DESC']];
                break;
            default:
                orderClause = [['points', 'DESC']];
                break;
        }

        const users = await User.findAll({
            attributes: [
                'username', 'neorimas', 'points',
                [sequelize.literal(`(
                    SELECT SUM(uc.minutes)
                    FROM "user-courses" AS uc
                    JOIN "courses" AS c ON c._id_course = uc._id_course
                    JOIN "user-paths" AS up ON up._id_user = uc._id_user
                    WHERE up._id_user = "User"."_id_user" AND up._id_path = c._id_path
                )`), 'totalMinutes']
            ],
            include: [{
                model: Path,
                attributes: ['name'],
                required: true,
                where: pathWhereClause  
            }],
            where: whereClause,
            order: orderClause
        });

        const formattedUsers = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            path: user.Paths[0].name,
            minutes: parseInt(user.dataValues.totalMinutes, 10) || 0,
            neorimas: user.neorimas,
            points: user.points
        }));

        let response = { users: formattedUsers };

        if (decodedUserSearch) {
            const user = formattedUsers.find(user => user.username === decodedUserSearch);
            if (!user) {
                response.message = 'User not found';
            } else {
                response.user = user;
            }
        }

        res.json(response);
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).send('Server error while fetching rankings');
    }
};

export const getUserRanking = async (req, res) => {
    const { _id_user } = req.body;

    try{
        const user = await User.findByPk(_id_user);

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send(user);
    
    } catch (error) {
        res.status(500).send({ error: error.message });
}
}
