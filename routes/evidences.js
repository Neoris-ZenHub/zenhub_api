import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import {
    createEvidence,
    getEvidencesOfUser,
    getEvidencesOfCourse,
    findOldestPendingEvidences,
    getEvidencesFormatted,
    checkEvidence
} from "../controllers/evidences.js";

const router = Router();

//----------Evidences Routes-------------

//Create Evidence (upload a file)
router.post("/", validateToken, uploadMiddleware, createEvidence);

//Get All evidences of a user
router.get("/user", validateToken, getEvidencesOfUser);

//Get All Evidences of a course
router.get("/course", validateToken, getEvidencesOfCourse);

//Find Oldest Pending Evidences
router.get("/pending", validateToken, findOldestPendingEvidences);

//Formatted evidence for dashboard
router.get("/dashboard", validateToken, getEvidencesFormatted);

//Update neorimas and points, update progress and delete evidence
router.put("/check", validateToken, checkEvidence);

export default router;