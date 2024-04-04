import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Middleware for validating token
export const validateToken = (req, res, next) => {
    const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token" });
        }

        req.user = decodedToken;
        next();
    });
};