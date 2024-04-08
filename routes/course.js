import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    createCourse,
    getAllCourses,
    getCourse,
    updateCourse,
} from "../controllers/courses.js";

const router = Router();

//----------Course Routes-------------

//Create Course
router.post("/", createCourse, validateToken);

//Get All Course
router.get("/all", getAllCourses, validateToken);

//Get Course with ID
router.get("/", getCourse, validateToken);

//Update Course
router.put("/", updateCourse, validateToken);

export default router;