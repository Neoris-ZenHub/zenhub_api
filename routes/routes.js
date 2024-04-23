
import userRoute from "./users.js";
import courseRoute from "./course.js";
import pathRoute from "./path.js";
import userPathRoute from "./user-path.js";
import userCourseRoute from "./user-course.js";
import evidenceRoute from "./evidences.js";
import spriteRoute from "./sprites.js";
import { Router } from "express";

const router = Router();

// Main Routes
router.use("/users", userRoute);
router.use("/course", courseRoute);
router.use("/path", pathRoute);
router.use("/users-paths", userPathRoute);
router.use("/users-courses", userCourseRoute);
router.use("/evidence", evidenceRoute);
router.use("/sprite", spriteRoute);

export default router;