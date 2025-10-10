import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";
import { ROLE_HIERARCHY } from "../constants/index.js";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "../utils/errors.js";

const { User, Role } = db;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new ForbiddenError("No token provided!");
        }

        const decoded = jwt.verify(token, config.secret);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new NotFoundError("User");
        }

        req.user = {
            id: user.id,
            username: user.username,
            link: user.link,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            next(new UnauthorizedError("Invalid token"));
        } else {
            next(error);
        }
    }
};

const optionalVerifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        const user = await User.findByPk(decoded.id);

        req.user = user
            ? {
                  id: user.id,
                  username: user.username,
                  link: user.link,
                  role: decoded.role,
              }
            : null;
    } catch (err) {
        req.user = null;
    }

    next();
};

const checkRole = (requiredRole) => async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Role, as: "role" }],
        });

        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.role) {
            throw new ForbiddenError("Role is undefined!");
        }

        const userRoleLevel = ROLE_HIERARCHY[user.role.name];
        const requiredLevel = ROLE_HIERARCHY[requiredRole];

        if (!requiredLevel) {
            throw new Error("Invalid role check");
        }

        if (userRoleLevel >= requiredLevel) {
            next();
        } else {
            throw new ForbiddenError(`Requires ${requiredRole} role or higher!`);
        }
    } catch (error) {
        next(error);
    }
};

const authJwt = {
    verifyToken,
    optionalVerifyToken,
    checkRole,
};

export default authJwt;
