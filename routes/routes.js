
import userRoute from "./users.js";
import courseRoute from "./course.js";
import { Router } from "express";

const router = Router();

// Main Routes
router.use("/users", userRoute);
router.use("/course", courseRoute);

export default router;