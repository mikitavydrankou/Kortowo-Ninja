export const buildLogContext = (req, extra = {}) => {
    if (!req) {
        return extra;
    }

    const context = { ...extra };

    if (req.requestId) {
        context.requestId = req.requestId;
    }

    if (req.method) {
        context.method = req.method;
    }

    if (req.originalUrl || req.url) {
        context.path = req.originalUrl || req.url;
    }

    if (req.ip) {
        context.ip = req.ip;
    }

    if (req.user) {
        context.actorId = req.user.id;
        context.actorUsername = req.user.username;
        context.actorRole = req.user.role;
    }

    return context;
};
