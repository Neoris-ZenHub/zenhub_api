dotenv.config();
import dotenv from "dotenv";
import Sequelize from "sequelize";
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

//Get ranking with specific filters
export const getRankings = async (req, res) => {
    const { orderBy, pathName } = req.body;

    try {
        let orderCriteria = [];
        if (orderBy === 'neorimas') {
            orderCriteria = [['neorimas', 'DESC']];
        } else if (orderBy === 'puntaje') {
            orderCriteria = [['points', 'DESC']];
        }

        let options = {
            attributes: [
                'name',
                [Sequelize.fn('SUM', Sequelize.col('UserCourses.progress')), 'hours'],
                'neorimas',
                'points'
            ],
            include: [
                {
                    model: Path,
                    attributes: [],
                    where: {},
                    required: false,
                    include: [{
                        model: Course,
                        attributes: [],
                        include: [{
                            model: UserCourse,
                            attributes: []
                        }]
                    }]
                }
            ],
            group: ['User._id_user', 'Path._id_path'],
            order: orderCriteria
        };

        if (pathName && pathName !== 'global') {
            options.include[0].where.name = pathName;
        }

        const rankingList = await User.findAll(options);

        const formattedRanking = rankingList.map((user, index) => ({
            ranking: index + 1,
            userName: user.name,
            hours: user.get('hours'),
            neorimas: user.neorimas,
            points: user.points
        }));

        res.json({ ranking: formattedRanking });
    } catch (error) {
        console.error("Error retrieving rankings:", error);
        res.status(500).send({ error: error.message });
    }
};





