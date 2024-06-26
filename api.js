import { sequelize } from "./config/db.js";
import { populateSprites } from "./utils/spriteBulkCreate.js"
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./models/associations.js";
import router from "./routes/routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: "GET, POST, PUT, DELETE",
        allowedHeaders: "Content-Type, Authorization",
    })
);

app.use(router);

async function main() {
    await sequelize.sync({ force: false });
    console.log("Connected to DB")

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        //populateSprites(); 
    });
}
main();

export default app;