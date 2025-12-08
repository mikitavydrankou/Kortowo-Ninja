import authJwt from "../middleware/authJwt.js";
import {
    allAccess,
    userBoard,
    adminBoard,
    moderatorBoard,
    users,
    leaderboard,
    getUserActiveOffers,
    getUserArchivedOffers,
    deleteUser,
    deleteSelf,
    getUserById,
    updateUserRole,
    updateUser,
    usersCount,
} from "../controllers/user.controller.js";

const routes = function (app) {
    // User routes
    app.put("/api/users/:id/role", [authJwt.verifyToken], updateUserRole);
    app.get("/api/users", [authJwt.verifyToken], users);
    app.get(
        "/api/users/:userId/offers/active",
        [authJwt.verifyToken],
        getUserActiveOffers
    );
    app.get(
        "/api/users/:userId/offers/archived",
        [authJwt.verifyToken],
        getUserArchivedOffers
    );
    app.get("/api/leaderboard", leaderboard);

    // Self-delete должен быть ПЕРЕД :id роутами
    app.delete("/api/users/me", [authJwt.verifyToken], deleteSelf);

    app.get("/api/users/:id", [authJwt.verifyToken], getUserById);
    app.delete(
        "/api/users/:id",
        [authJwt.verifyToken, authJwt.checkRole("admin")],
        deleteUser
    );
    app.put("/api/users/:id", [authJwt.verifyToken], updateUser);

    app.get("/api/auth/me", [authJwt.optionalVerifyToken], (req, res) => {
        if (!req.user) {
            return res.json(null);
        }
        res.json(req.user);
    });

    app.get("/api/count", usersCount);
};

export default routes;
