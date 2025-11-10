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
    // In production with HTTPS set COOKIE_SECURE=true. Falls back to NODE_ENV check.
    secure: process.env.COOKIE_SECURE === "true" ? true : process.env.NODE_ENV === "production",
    // Use COOKIE_SAMESITE to override (e.g., "None" when cross-site and secure=true)
    sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === "production" ? "None" : "Lax"),
    // Optionally scope cookie to a domain (e.g., kortowo.ninja)
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 86400 * 1000, // 24 hours
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
export const FACEBOOK_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(facebook|fb)\.com\/[\S]+$/i;