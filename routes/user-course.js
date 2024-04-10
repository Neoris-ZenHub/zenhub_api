import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    getUserCourses,
} from "../controllers/user-course.js";

const router = Router();

//----------User Courses Routes-------------

//Get User Paths
router.get("/",validateToken, getUserCourses);


export default router;