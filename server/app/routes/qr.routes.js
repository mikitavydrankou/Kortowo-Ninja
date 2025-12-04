import db from "../models/index.js";
import logger from "../config/logger.js";
import { buildLogContext } from "../utils/logContext.js";
const QRCounter = db.QRCounter;

const routes = function (app) {
    app.get("/qr/:code", async (req, res) => {
        const code = req.params.code;

        try {
            const qr = await QRCounter.findOne({ where: { code } });

            if (!qr) {
                return res.status(404).send("QR code not found");
            }

            await QRCounter.increment("hits", { where: { code } });
            res.redirect(302, "https://kortowo.ninja/");
        } catch (error) {
            logger.error(
                "Error in QR-counter",
                buildLogContext(req, {
                    event: "qr.counter.error",
                    error: error.message,
                })
            );
            res.status(500).send(
                "Jakiś błąd, sprobuj podłączyć się na - kortowo.ninja"
            );
        }
    });
};

export default routes;
