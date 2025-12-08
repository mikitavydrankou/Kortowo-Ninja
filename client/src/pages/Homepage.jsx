import { Box, Typography, CircularProgress } from "@mui/material";
import AddOfferButton from "../components/buttons/AddOfferButton";
import OfferList from "../components/offer/OfferList";
import { InfoButton } from "../components/buttons/InfoButton";
import { useAuthStore } from "../store/authStore";
import { getUserCount, getOfferCount, getTopUsers } from "../api/featureAPI.js";
import { useEffect, useState } from "react";

const HomePage = () => {
    const user = useAuthStore((s) => s.user);
    const [topUsers, setTopUsers] = useState(null);
    const [userCount, setUserCount] = useState(null);
    const [offerCount, setOfferCount] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaders, users, offers] = await Promise.all([
                    getTopUsers(),
                    getUserCount(),
                    getOfferCount(),
                ]);
                setTopUsers(leaders);
                setUserCount(users);
                setOfferCount(offers);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);

    const TopUsersPanel = () => {
        if (topUsers === null) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            );
        }

        if (!topUsers || topUsers.length === 0) {
            return null;
        }

        const podiumOrder = [topUsers[1], topUsers[0], topUsers[2]].filter(Boolean);
        const heights = [70, 90, 55];
        const colors = ["#A0A0A0", "#FFD700", "#CD7F32"];
        const positions = ["#2", "#1", "#3"];

        return (
            <Box sx={{ borderRadius: 3, p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 2 }}>
                    <Typography variant="body1" fontWeight={600}>
                        Top Ninja za ostatnie 20 dni
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 0 }}>
                    {podiumOrder.map((userItem, idx) => (
                        <Box
                            key={userItem?.userId || idx}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: 100,
                            }}
                        >
                            <Typography
                                component={userItem?.user?.link ? "a" : "span"}
                                href={userItem?.user?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    maxWidth: 90,
                                    textAlign: "center",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    mb: 0.3,
                                    textDecoration: "none",
                                    color: "text.primary",
                                    cursor: userItem?.user?.link ? "pointer" : "default",
                                    transition: "opacity 0.2s",
                                    "&:hover": userItem?.user?.link ? { opacity: 0.7 } : {},
                                }}
                            >
                                {userItem?.user?.username || "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.3 }}>
                                {userItem?.offerCount || 0} ofert
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    height: heights[idx],
                                    background: `linear-gradient(180deg, ${colors[idx]}40 0%, ${colors[idx]}20 100%)`,
                                    borderTop: `3px solid ${colors[idx]}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, fontSize: 22, color: colors[idx] }}>
                                    {positions[idx]}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                maxWidth: "800px",
                mx: "auto",
            }}
        >
            {!user && (
                <Box
                    sx={{
                        width: "100%",
                        zIndex: 1000,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        Ninja — wymiana na Kortowie
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Dołącz i wymieniaj się z innymi studentami
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 3, mb: 3 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {userCount ?? "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                zarejestrowanych studentów
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {offerCount ?? "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                utworzonych ofert
                            </Typography>
                        </Box>
                    </Box>

                    <InfoButton />
                </Box>
            )}

            <TopUsersPanel />

            <Box>
                {user && <AddOfferButton />}

                <Box sx={{ mb: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, color: "text.secondary" }}>
                        Oferty innych użytkowników
                    </Typography>
                </Box>

                <OfferList />
            </Box>
        </Box>
    );
};

export default HomePage;
