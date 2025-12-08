import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});

export const getUserCount = async () => {
    try {
        const res = await api.get("/count");
        return res.data.count;
    } catch (error) {
        return null;
    }
};

export const getOfferCount = async () => {
    try {
        const res = await api.get("/offer/count");
        return res.data.count;
    } catch (error) {
        return null;
    }
};

export const getTopUsers = async () => {
    try {
        const res = await api.get("/leaderboard");
        return res.data.data;
    } catch (error) {
        return null;
    }
};
