import logger from "../config/logger.js";
import { AppError } from "../utils/errors.js";
import db from "../models/index.js";
import { buildLogContext } from "../utils/logContext.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(
        err.message,
        buildLogContext(req, {
            event: "http.request.error",
            statusCode: err.statusCode || 500,
        })
    );

    if (err instanceof db.Sequelize.ValidationError) {
        return res.status(400).json({
            message: err.errors.map((e) => e.message).join(", "),
        });
    }

    if (err instanceof db.Sequelize.UniqueConstraintError) {
        return res.status(400).json({
            message: err.errors.map((e) => e.message).join(", "),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    res.status(500).json({
        message: "Internal server error",
    });
};