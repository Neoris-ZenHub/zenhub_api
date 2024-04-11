import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    getUserPath,
    createUserPath
} from "../controllers/user-paths.js";

const router = Router();

//----------User Path Routes-------------

//Get User Paths
router.get("/",validateToken, getUserPath);

//Create User Path
router.post("/",validateToken, createUserPath);

export default router;