import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    getRandomSprites,
    buySprite
} from "../controllers/sprites.js";

const router = Router();

//----------Sprites Routes-------------

//Get 6 random sprites for marketplace
router.get("/random", validateToken, getRandomSprites);

//Buy a sprite from marketplace
router.post("/", validateToken, buySprite);

export default router;