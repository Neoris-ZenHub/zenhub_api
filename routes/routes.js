
import userRoute from "./users.js";
import { Router } from "express";

const router = Router();

// Main Routes
router.use("/users", userRoute);

export default router;