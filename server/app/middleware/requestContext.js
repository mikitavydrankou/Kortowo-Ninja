import { randomUUID } from "crypto";

export const attachRequestContext = (req, res, next) => {
    if (!req.requestId) {
        req.requestId = randomUUID();
    }

    res.setHeader("X-Request-ID", req.requestId);
    next();
};
