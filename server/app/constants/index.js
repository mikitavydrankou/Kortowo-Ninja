export const ROLES = {
    USER: "user",
    ADMIN: "admin",
    MODERATOR: "moderator",
};

export const ROLE_HIERARCHY = {
    [ROLES.USER]: 1,
    [ROLES.MODERATOR]: 2,
    [ROLES.ADMIN]: 3,
};

export const OFFER_STATUS = {
    ACTIVE: "active",
    ARCHIVED: "archived",
};

export const PLACES = [
    "DS1",
    "DS2",
    "DS3",
    "DS4",
    "DS6",
    "DS7",
    "DS8",
    "DS9",
    "DS119",
    "Górka Kortowska",
];

export const COOKIE_SETTINGS = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" ? true : process.env.NODE_ENV === "production",
    sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === "production" ? "None" : "Lax"),
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 86400 * 1000,
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
export const FACEBOOK_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(facebook|fb)\.com\/[\S]+$/i;