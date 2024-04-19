import Sequelize from "sequelize";
import { Course } from "../models/courses.js";
import { Evidence } from "../models/evidence.js";
import { User } from "../models/users.js";
import { Path } from "../models/paths.js";
import { sequelize } from "../config/db.js";

// Create a new evidence entry
export const createEvidence = async (req, res) => {
    try {
        const _id_user = req.user._id_user; 
        const { name } = req.query; 

        const decodedName = decodeURIComponent(name);
        let evidence_image = null;
        
        if (req.file) {
            evidence_image = req.file.buffer; 
        }

        const course = await Course.findOne({
            where: { name: decodedName}
        })

        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        const evidence = await Evidence.create({
            _id_user,
            _id_course: course._id_course,
            status: false, 
            evidence_image
        });

        res.status(201).json(evidence);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get all evidences of a user
export const getEvidencesOfUser = async (req, res) => {
    try {
        const _id_user = req.user._id_user;  

        if (!_id_user) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const evidences = await Evidence.findAll({
            where: { _id_user: _id_user } 
        });

        if (evidences.length === 0) {
            return res.status(404).json({ message: "No evidences found for this user." });
        }

        res.json(evidences);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all evidences of a course
export const getEvidencesOfCourse = async (req, res) => {
    try {
        const _id_course = req.body._id_course;  

        if (!_id_course) {
            return res.status(400).json({ error: "Course ID is required" });
        }

        const evidences = await Evidence.findAll({
            where: { _id_course: _id_course }  
        });

        if (evidences.length === 0) {
            return res.status(404).json({ message: "No evidences found for this course." });
        }

        res.json(evidences);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all evidences where status is false, ordered by creation date (oldest first)
export const findOldestPendingEvidences = async (req, res) => {
    try {
        const evidences = await Evidence.findAll({
            where: { status: false }, 
            order: [
                ['createdAt', 'ASC']  
            ]
        });

        if (evidences.length === 0) {
            return res.status(404).json({ message: "No unchecked evidences found." });
        }

        res.json(evidences);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Evidences for dashboard or reporting
export const getEvidencesFormatted = async (req, res) => {
    try {
        const { groupField, userSearch } = req.body; 

        if (!groupField) {
            return res.status(400).json({ message: 'Group field parameter is required' });
        }

        let whereClause = groupField === 'global' ? '' : 'WHERE p.name = :groupName';
        let sql = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY e."createdAt" ASC) AS "index",
                u.username AS "username", 
                c.name AS "course", 
                p.name AS "path"
            FROM users AS u
            JOIN evidences AS e ON u._id_user = e._id_user 
            JOIN courses AS c ON e._id_course = c._id_course
            JOIN paths AS p ON p._id_path = c._id_path
            ${whereClause}
            ORDER BY e."createdAt" ASC
        `;

        const evidences = await sequelize.query(sql, {
            replacements: { groupName: groupField }, 
            type: sequelize.QueryTypes.SELECT
        });

        let response = { evidences };

        if (userSearch) {
            const filteredEvidences = evidences.filter(evidence => evidence.username === userSearch);
            if (filteredEvidences.length > 0) {
                response.evidences = filteredEvidences;
            } else {
                response.message = "User not found"; 
            }
        }

        res.json(response);
    } catch (error) {
        console.error('Error fetching evidences:', error);
        res.status(500).send('Server error while fetching evidences');
    }
};



