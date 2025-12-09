import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import config from "../config/auth.config.js";
import logger from "../config/logger.js";
import { COOKIE_SETTINGS, ROLES } from "../constants/index.js";
import { ValidationError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PASSWORD_REGEX } from "../constants/index.js";
import { buildLogContext } from "../utils/logContext.js";

const { User, Role } = db;

const validatePasswordStrength = (password) => {
    if (!password) {
        throw new ValidationError("Hasło nie może być puste");
    }

    if (password.length < 8) {
        throw new ValidationError("Hasło musi mieć co najmniej 8 znaków");
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw new ValidationError(
            "Hasło musi zawierać co najmniej jedną małą i wielką literę, cyfrę oraz znak specjalny"
        );
    }
};

export const signup = asyncHandler(async (req, res) => {
    const { username, password, link } = req.body;

    validatePasswordStrength(password);

    const role = await Role.findOne({ where: { name: ROLES.USER } });
    if (!role) {
        throw new Error("Nie znaleziono roli 'user'");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
        username,
        password: hashedPassword,
        roleId: role.id,
        link,
    });

    const token = jwt.sign({ id: user.id, role: role.name }, config.secret, {
        algorithm: "HS256",
        expiresIn: 86400,
    });

    res.cookie("token", token, COOKIE_SETTINGS);

    logger.info(
        `User ${user.username} signed up successfully`,
        buildLogContext(req, {
            event: "auth.signup.success",
            userId: user.id,
            username: user.username,
        })
    );

    res.status(200).json({
        message: "Użytkownik zarejestrował się pomyślnie!",
        id: user.id,
        username: user.username,
        role: role.name,
        link: user.link,
        createdAt: user.createdAt,
    });
});

export const signin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ValidationError("Wymagana jest nazwa użytkownika i hasło");
    }

    const user = await User.findOne({
        where: { username },
        include: Role,
    });

    if (!user) {
        throw new NotFoundError("Użytkownik");
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
        throw new UnauthorizedError("Nieprawidłowe dane");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role.name },
        config.secret,
        {
            algorithm: "HS256",
            expiresIn: 86400,
        }
    );

    res.cookie("token", token, COOKIE_SETTINGS);

    logger.info(
        `User ${user.username} signed in successfully`,
        buildLogContext(req, {
            event: "auth.signin.success",
            userId: user.id,
            username: user.username,
        })
    );

    res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role?.name,
        link: user.link,
        createdAt: user.createdAt,
    });
});

export const signout = (req, res) => {
    res.clearCookie("token", COOKIE_SETTINGS);
    res.status(200).json({ message: "Wyloguj się pomyślnie" });
};
