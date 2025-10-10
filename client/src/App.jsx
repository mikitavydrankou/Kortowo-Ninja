import { CssBaseline, Container, Box } from "@mui/material";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/Homepage";
import SigninPage from "./pages/authPages/SigninPage";
import SignupPage from "./pages/authPages/SignupPage";
import TopNavbar from "./components/navbars/TopNavbar";
import BottomNavbar from "./components/navbars/BottomNavbar";
import OfferPage from "./pages/OfferPage";
import { CreateOfferPage } from "./pages/CreateOfferPage";
import { useAuthStore } from "./store/authStore";
import InfoPage from "./pages/InfoPage";

const ROUTES = {
    HOME: "/",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    OFFER: "/offer/:id",
    OFFER_CREATE: "/offer/create",
    PROFILE: "/profile",
};

const MainLayout = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
            background: `url('/topography.svg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}
    >
        <TopNavbar />
        <Container
            component="main"
            sx={{
                flex: 1,
                py: 4,
                mt: { xs: "56px", sm: "64px" },
                mb: { xs: "56px", sm: "64px" },
                px: { xs: 2, sm: 3 },
            }}
        >
            <Outlet />
        </Container>
        <BottomNavbar />
    </Box>
);

function App() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <CssBaseline />
            <Routes>
                <Route path={ROUTES.SIGNIN} element={<SigninPage />} />
                <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={ROUTES.OFFER} element={<OfferPage />} />

                <Route element={<MainLayout />}>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.PROFILE} element={<InfoPage />} />
                    <Route path={ROUTES.OFFER_CREATE} element={<CreateOfferPage />} />
                    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
