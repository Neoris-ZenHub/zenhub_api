import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    createUser,
    logIn,
    getUser,
    getRankings,
    getUserRanking
} from "../controllers/users.js";

const router = Router();

//----------User Routes-------------

//Create User
router.post("/", createUser);

//Log In
router.post("/login", logIn);

//Get User
router.get("/homepage/", validateToken, getUser);

//Get Ranking
router.get("/ranking", validateToken, getRankings);

//Get User Ranking
router.get("/ranking/user", validateToken, getUserRanking);

export default router;