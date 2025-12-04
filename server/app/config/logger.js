import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors } = winston.format;

const LOG_DIR = process.env.LOG_DIR || path.resolve("logs");
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const sanitizeValue = (value) => {
    if (value === undefined || value === null) {
        return undefined;
    }

    if (typeof value === "string") {
        if (value.length === 0) {
            return '""';
        }

        const needsQuotes = /[\s"=]/.test(value);
        const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        return needsQuotes ? `"${escaped}"` : escaped;
    }

    if (typeof value === "object") {
        const serialized = JSON.stringify(value, (_, v) => v ?? undefined);
        return serialized ? `"${serialized.replace(/"/g, '\\"')}"` : undefined;
    }

    return value;
};

const logfmtFormat = printf(({ timestamp, level, message, event, stack, ...meta }) => {
    const baseFields = {
        ts: timestamp,
        level: (level || "info").toUpperCase(),
        event: event || "event.unknown",
        msg: typeof message === "string" ? message : JSON.stringify(message)
    };

    const details = { ...baseFields, ...meta };

    if (stack) {
        details.stack = stack.replace(/\s*\n+\s*/g, " | ").trim();
    }

    const kvPairs = [];
    Object.entries(details).forEach(([key, value]) => {
        const formatted = sanitizeValue(value);
        if (formatted === undefined) {
            return;
        }
        kvPairs.push(`${key}=${formatted}`);
    });

    return kvPairs.join(" ");
});

const consoleTransport = new winston.transports.Console({
    level: process.env.LOG_LEVEL || "debug",
});

const fileTransport = new DailyRotateFile({
    filename: path.join(LOG_DIR, "application-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
});

const errorFileTransport = new DailyRotateFile({
    filename: path.join(LOG_DIR, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
});

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    defaultMeta: { service: "kortowo-backend" },
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        errors({ stack: true }),
        logfmtFormat
    ),
    transports: [consoleTransport, fileTransport, errorFileTransport],
    exitOnError: false,
});

export default logger;
