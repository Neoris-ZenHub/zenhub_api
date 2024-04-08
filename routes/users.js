import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    createUser,
    logIn,
    getUser
} from "../controllers/users.js";

const router = Router();

//----------User Routes-------------

//Create User
router.post("/", createUser);

//Log In
router.post("/login", logIn);

//Get User
router.get("/homepage/", validateToken, getUser);

export default router;