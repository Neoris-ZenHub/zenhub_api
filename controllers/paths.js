import { Path } from "../models/paths.js";
import Sequelize from "sequelize";

//Create a new path
export const createPath = async (req,res) => {
    try{
        const {
            name,
            description,
        } = req.body;

        const requiredFields = [
            "name",
            "description",
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res
                    .status(400)
                    .send({ message: `Missing ${field} field` });
            }
        }

        const newPath = await Path.create({
            name,
            description
        });

        res.status(200).send({
            message: "Path created successfully",
            path: newPath,
        });

    }catch (error) {
        console.error("Error during path creation:", error);

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

//Get all paths
export const getAllPaths = async (req,res) => {
    try{
        const allPaths = await Path.findAll({
            where: {}
        })

        res.status(200).send({
            message: "Path created successfully",
            paths: allPaths,
        });

    }catch (error) {
        console.error("Error during path retrieval:", error);

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

// Get 4 random paths
export const getRandomPaths = async (req, res) => {
    try {
        const randomPaths = await Path.findAll({
            order: Sequelize.literal('RANDOM()'),
            limit: 4
        });

        res.status(200).send({
            message: "Random paths retrieved successfully",
            paths: randomPaths,
        });
    } catch (error) {
        console.error("Error during random path retrieval:", error);

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

//Get path with id
export const getPath = async (req,res) => {
    try{
        const _id_path = req.query._id_path;

        const path = await Path.findByPk(_id_path)

        if(!path){
            return res.status(404).send({message: "Path not found"});
        }

        res.status(200).send({
            message: "Path created successfully",
            path: path,
        });

    }catch (error) {
        console.error("Error during path retrieval:", error);

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

//Update path with id
export const updatePath = async (req,res) => {
    try {
        const _id_path = req.query._id_path;
        const { name } = req.body;

        const path = await Path.findByPk(_id_path);
        if (!path) {
            return res.status(404).send({ message: "Path not found" });
        }

        const updated = await path.update({
            name,
        });

        if (updated) {
            return res.status(200).send({
                message: "Path updated successfully",
                path: updated,
            });
        } else {
            return res.status(400).send({
                message: "Failed to update the path"
            });
        }

    } catch (error) {
        console.error("Error during path update:", error);

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



