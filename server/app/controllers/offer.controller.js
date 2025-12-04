import db from "../models/index.js";
import logger from "../config/logger.js";
import { OFFER_STATUS } from "../constants/index.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildLogContext } from "../utils/logContext.js";

const { Offer, User } = db;

const USER_INCLUDE_SETTINGS = {
    model: User,
    attributes: ["id", "username", "link"],
};

const validateOfferAccess = (offer, userId, userRole) => {
    if (
        offer.userId !== userId &&
        userRole !== "admin" &&
        userRole !== "moderator"
    ) {
        throw new ForbiddenError();
    }
};

export const getActiveOffers = asyncHandler(async (req, res) => {
    const offers = await Offer.findAll({
        where: {
            status: OFFER_STATUS.ACTIVE,
            expiresAt: { [db.Sequelize.Op.gt]: new Date() },
        },
        include: [USER_INCLUDE_SETTINGS],
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json(offers);
});

export const getArchivedOffers = asyncHandler(async (req, res) => {
    const offers = await Offer.findAll({
        where: { status: OFFER_STATUS.ARCHIVED },
        include: [USER_INCLUDE_SETTINGS],
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json(offers);
});

export const createOffer = asyncHandler(async (req, res) => {
    const { title, description, ttlHours, place, counter_offer } = req.body;

    if (!title || !description || !ttlHours || !place) {
        throw new ValidationError("All fields are required!");
    }

    const ttlHoursNumber = Number(ttlHours);
    if (isNaN(ttlHoursNumber) || ttlHoursNumber < 1) {
        throw new ValidationError("Invalid TTL value");
    }

    const expiresAt = new Date(Date.now() + ttlHoursNumber * 3600 * 1000);

    const offer = await Offer.create({
        title,
        place,
        counter_offer,
        description,
        ttlHours,
        expiresAt,
        userId: req.user.id,
        status: OFFER_STATUS.ACTIVE,
    });

    logger.info(
        `User "${req.user.username}" created offer`,
        buildLogContext(req, {
            event: "offer.create",
            offerId: offer.id,
            title: offer.title,
            userId: req.user.id,
            username: req.user.username,
        })
    );

    res.status(201).json(offer);
});

export const deleteOffer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const offer = await Offer.findByPk(id);

    if (!offer) {
        throw new NotFoundError("Offer");
    }

    validateOfferAccess(offer, req.user.id, req.user.role);

    await offer.destroy();

    logger.info(
        `User "${req.user.username}" deleted offer`,
        buildLogContext(req, {
            event: "offer.delete",
            offerId: offer.id,
            title: offer.title,
            userId: req.user.id,
            username: req.user.username,
        })
    );

    res.status(200).json({ message: "Offer deleted successfully" });
});

export const updateOffer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const offer = await Offer.findByPk(id);

    if (!offer) {
        throw new NotFoundError("Offer");
    }

    validateOfferAccess(offer, req.user.id, req.user.role);

    const updatedOffer = await offer.update(req.body);

    logger.info(
        `User "${req.user.username}" updated offer`,
        buildLogContext(req, {
            event: "offer.update",
            offerId: offer.id,
            title: offer.title,
            userId: req.user.id,
            username: req.user.username,
        })
    );

    res.status(200).json(updatedOffer);
});

export const fetchOfferById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const offer = await Offer.findByPk(id, {
        include: [USER_INCLUDE_SETTINGS],
    });

    if (!offer) {
        throw new NotFoundError("Offer");
    }

    res.status(200).json(offer);
});

export const countAllOffers = asyncHandler(async (req, res) => {
    const count = await Offer.count();
    res.status(200).json({ count });
});
