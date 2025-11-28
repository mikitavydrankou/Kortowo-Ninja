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
                        console.log(`Current roles count: ${count}`);

                        if (count === 0) {
                            console.log('Creating initial roles...');

                            const roles = [
                                { id: 1, name: "user", description: "Regular user" },
                                { id: 2, name: "admin", description: "Administrator" },
                                { id: 3, name: "moderator", description: "Content moderator" },
                            ];

                            await Role.bulkCreate(roles, {
                                validate: true,
                                ignoreDuplicates: true
                            });

                            console.log("Initial roles created successfully");
                        } else {
                            console.log("Roles already exist, skipping creation");
                        }
                    } catch (error) {
                        console.error("Error creating initial roles:", error);
                    }
                },
            },
        }
    );

    return Role;
};

export default roleModel;
