import config from "../config/db.config.js";
import Sequelize from "sequelize";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";
import offerModel from "./offer.model.js";
import QRCounterModel from "./QRCounter.model.js";
import schedule from "node-schedule";
import logger from "../config/logger.js";
import { ROLES, OFFER_STATUS } from "../constants/index.js";

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");
} catch (error) {
    logger.error("Unable to connect to the database:", { error: error.message });
    process.exit(1);
}

const db = {
    Sequelize,
    sequelize,
};

db.User = userModel(sequelize, Sequelize);
db.Role = roleModel(sequelize, Sequelize);
db.Offer = offerModel(sequelize, Sequelize);
db.QRCounter = QRCounterModel(sequelize, Sequelize);

db.Offer.addHook("beforeFind", (options) => {
    if (!options.where?.status) {
        options.where = {
            ...options.where,
            expiresAt: { [db.Sequelize.Op.gt]: new Date() },
        };
    }
});

db.User.belongsTo(db.Role);
db.Role.hasMany(db.User, { as: "role", foreignKey: "roleId" });

db.Offer.belongsTo(db.User);
db.User.hasMany(db.Offer, { as: "user", foreignKey: "userId" });

db.ROLES = Object.values(ROLES);

schedule.scheduleJob("*/5 * * * *", async () => {
    try {
        const result = await db.Offer.update(
            { status: OFFER_STATUS.ARCHIVED },
            {
                where: {
                    expiresAt: { [Sequelize.Op.lt]: new Date() },
                    status: OFFER_STATUS.ACTIVE,
                },
            }
        );
        if (result[0] > 0) {
            logger.info(`Archived ${result[0]} expired offers`);
        }
    } catch (error) {
        logger.error("Error archiving offers:", { error: error.message });
    }
});

export default db;
