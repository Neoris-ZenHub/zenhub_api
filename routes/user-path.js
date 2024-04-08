import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    getUserPath,
} from "../controllers/user-paths.js";

const router = Router();

//----------User Path Routes-------------

//Get User Paths
router.get("/",validateToken, getUserPath);


export default router;