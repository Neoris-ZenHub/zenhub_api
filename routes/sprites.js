import { Router } from "express";
import { validateToken } from "../middlewares/jwt.js";
import {
    getRandomSprites,
    buySprite,
    getUserSprites
} from "../controllers/sprites.js";

const router = Router();

//----------Sprites Routes-------------

//Get 6 random sprites for marketplace
router.get("/random", validateToken, getRandomSprites);

//Buy a sprite from marketplace
router.post("/", validateToken, buySprite);

//Get user sprites
router.get("/user", validateToken, getUserSprites);

export default router;