import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    createCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    getCoursesByPath
} from "../controllers/courses.js";

const router = Router();

//----------Course Routes-------------

//Create Course
router.post("/", validateToken, createCourse);

//Get All Course
router.get("/all", validateToken, getAllCourses);

//Get Course with ID
router.get("/", validateToken, getCourse);

//Update Course
router.put("/", validateToken, updateCourse);

//Courses by Path
router.get("/path", validateToken, getCoursesByPath);

export default router;