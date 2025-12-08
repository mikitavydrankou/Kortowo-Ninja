import db from "../models/index.js";
import logger from "../config/logger.js";
import { buildLogContext } from "../utils/logContext.js";
const Offer = db.Offer;

const USER_INCLUDE_SETTINGS = {
    model: db.User,
    attributes: ["id", "username", "link"],
};

export const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
export const userBoard = (req, res) => {
    res.status(200).send("User content.");
};

export const adminBoard = (req, res) => {
    res.status(200).send("Admin content.");
};

export const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator content.");
};

export const leaderboard = async (req, res) => {
    try {
        const rankingStartDate = new Date();
        rankingStartDate.setDate(rankingStartDate.getDate() - 20);

        const topUsers = await db.Offer.findAll({
            attributes: [
                "userId",
                [
                    db.sequelize.fn("COUNT", db.sequelize.col("offers.id")),
                    "offerCount",
                ],
            ],

            where: {
                status: ["active", "archived"],
                createdAt: {
                    [db.Sequelize.Op.gte]: rankingStartDate,
                },
            },
            group: ["offers.userId", "user.id", "user.username", "user.link"],
            order: [[db.sequelize.literal("offerCount"), "DESC"]],
            limit: 3,
            include: [
                {
                    model: db.User,
                    as: "user",
                    attributes: ["id", "username", "link"],
                },
            ],
        });

        res.status(200).json({ success: true, data: topUsers });
    } catch (error) {
        logger.error(
            "Error fetching top users",
            buildLogContext(req, {
                event: "users.leaderboard.error",
                error: error.message,
            })
        );
        res.status(500).json({
            success: false,
            message: "Error fetching top users",
            error: error.message,
        });
    }
};

export const users = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "moderator") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const users = await db.User.findAll({
            include: [
                {
                    model: db.Role,
                    as: "role",
                },
            ],
        });

        res.status(200).json(users);
    } catch (err) {
        logger.error(
            "Error while getting users",
            buildLogContext(req, {
                event: "users.list.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Error while getting users" });
    }
};

export const getUserActiveOffers = async (req, res) => {
    try {
        const { userId } = req.params;

        if (
            req.user.id !== Number(userId) &&
            req.user.role !== "admin" &&
            req.user.role !== "moderator"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const offers = await db.Offer.findAll({
            where: {
                userId,
                status: "active",
                expiresAt: { [db.Sequelize.Op.gt]: new Date() },
            },
            include: [USER_INCLUDE_SETTINGS],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(offers);
    } catch (err) {
        logger.error(
            "Error fetching user active offers",
            buildLogContext(req, {
                event: "users.offers.active.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to get user active offers" });
    }
};

export const getUserArchivedOffers = async (req, res) => {
    try {
        const { userId } = req.params;

        if (
            req.user.id !== Number(userId) &&
            req.user.role !== "admin" &&
            req.user.role !== "moderator"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const offers = await db.Offer.findAll({
            where: {
                userId,
                status: "archived",
            },
            include: [USER_INCLUDE_SETTINGS],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(offers);
    } catch (err) {
        logger.error(
            "Error fetching user archived offers",
            buildLogContext(req, {
                event: "users.offers.archived.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to get user archived offers" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            req.user.id !== Number(id) &&
            req.user.role !== "admin" &&
            req.user.role !== "moderator"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const user = await db.User.findByPk(id, {
            include: [{ model: db.Role, as: "role" }],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        logger.error(
            "Error fetching user",
            buildLogContext(req, {
                event: "users.detail.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to get user" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await db.Offer.destroy({ where: { userId: id } });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        logger.error(
            "Error deleting user",
            buildLogContext(req, {
                event: "users.delete.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to delete user" });
    }
};

export const deleteSelf = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await db.Offer.destroy({ where: { userId } });
        await user.destroy();

        res.clearCookie("accessToken");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        logger.error(
            "Error deleting own account",
            buildLogContext(req, {
                event: "users.deleteSelf.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to delete account" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, link } = req.body;

        if (
            req.user.id !== Number(id) &&
            req.user.role !== "admin" &&
            req.user.role !== "moderator"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const user = await db.User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ username, link });
        res.status(200).json(user);
    } catch (err) {
        logger.error(
            "Error updating profile",
            buildLogContext(req, {
                event: "users.update.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to update profile" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role: newRole } = req.body;

        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const role = await db.Role.findOne({ where: { name: newRole } });
        if (!role) {
            return res.status(400).json({ message: "Role does not exist" });
        }

        await user.update({ roleId: role.id });
        res.status(200).json({ message: "User role updated successfully" });
    } catch (err) {
        logger.error(
            "Error updating role",
            buildLogContext(req, {
                event: "users.role.update.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to update role" });
    }
};

export const usersCount = async (req, res) => {
    try {
        const count = await db.User.count();
        res.status(200).json({ count });
    } catch (err) {
        logger.error(
            "User count error",
            buildLogContext(req, {
                event: "users.count.error",
                error: err.message,
            })
        );
        res.status(500).json({ message: "Failed to get user count" });
    }
};
