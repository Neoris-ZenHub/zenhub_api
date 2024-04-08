import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    createPath,
    getAllPaths,
    getRandomPaths,
    getPath,
    updatePath,
} from "../controllers/paths.js";

const router = Router();

//----------Path Routes-------------

//Create Path
router.post("/", validateToken, createPath);

//Get All Paths
router.get("/all",validateToken, getAllPaths);

//Get Random Paths
router.get("/random",validateToken, getRandomPaths);

//Get Path
router.get("/", validateToken, getPath);

//Update Path
router.put("/",validateToken, updatePath);

export default router;