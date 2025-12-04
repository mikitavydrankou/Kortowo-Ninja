import logger from "../config/logger.js";

const roleModel = (sequelize, Sequelize) => {
    const Role = sequelize.define(
        "roles",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
        },
        {
            timestamps: false,
            hooks: {
                afterSync: async (options) => {
                    try {
                        const count = await Role.count();
                        logger.info(`Current roles count: ${count}`, {
                            event: "roles.seed.count",
                            count,
                        });

                        if (count === 0) {
                            logger.info("Creating initial roles", {
                                event: "roles.seed.start",
                            });

                            const roles = [
                                { id: 1, name: "user", description: "Regular user" },
                                { id: 2, name: "admin", description: "Administrator" },
                                { id: 3, name: "moderator", description: "Content moderator" },
                            ];

                            await Role.bulkCreate(roles, {
                                validate: true,
                                ignoreDuplicates: true
                            });

                            logger.info("Initial roles created successfully", {
                                event: "roles.seed.success",
                            });
                        } else {
                            logger.info("Roles already exist, skipping creation", {
                                event: "roles.seed.skip",
                            });
                        }
                    } catch (error) {
                        logger.error("Error creating initial roles", {
                            event: "roles.seed.error",
                            error: error.message,
                        });
                    }
                },
            },
        }
    );

    return Role;
};

export default roleModel;
