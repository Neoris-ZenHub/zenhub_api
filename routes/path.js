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
router.post("/", createPath, validateToken);

//Get All Paths
router.get("/all", getAllPaths, validateToken);

//Get Random Paths
router.get("/random", getRandomPaths, validateToken);

//Get Path
router.get("/", getPath, validateToken);

//Update Path
router.put("/", updatePath, validateToken);

export default router;