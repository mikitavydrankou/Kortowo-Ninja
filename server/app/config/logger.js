import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

const consoleTransport = new winston.transports.Console({
    format: combine(colorize(), logFormat),
    level: process.env.LOG_LEVEL || "debug",
});

const fileTransport = new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    format: logFormat,
    level: "info",
});

const errorFileTransport = new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
    format: logFormat,
    level: "error",
});

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true })
    ),
    transports: [consoleTransport, fileTransport, errorFileTransport],
    exitOnError: false,
});

export default logger;
