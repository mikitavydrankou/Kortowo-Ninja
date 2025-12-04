import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import cookieParser from "cookie-parser";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import offerRoutes from "./app/routes/offer.routes.js";
import qrRoutes from "./app/routes/qr.routes.js";
import dotenv from "dotenv";
import { validateEnv } from "./app/config/validateEnv.js";
import { errorHandler } from "./app/middleware/errorHandler.js";
import logger from "./app/config/logger.js";
import { attachRequestContext } from "./app/middleware/requestContext.js";
dotenv.config();
validateEnv();

const app = express();
const port = process.env.API_PORT;

app.set("trust proxy", 1);

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(attachRequestContext);

db.sequelize.sync();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application!" });
});

authRoutes(app);
userRoutes(app);
offerRoutes(app);
qrRoutes(app);

app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server running on port ${port}`, { event: "server.start", port });
});

process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection", { event: "process.unhandledRejection", error: err.message });
    process.exit(1);
});
