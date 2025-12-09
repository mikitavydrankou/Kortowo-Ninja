import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    useTheme,
    Box,
} from "@mui/material";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const TopNavbar = () => {
    const theme = useTheme();
    const { isAdminOrModerator } = useAuthStore();

    return (
        <AppBar
            position="fixed"
            sx={{
                bgcolor: "background.default",
                color: "text.primary",
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                backgroundImage: "none",
            }}
        >
            <Toolbar
                sx={{
                    height: 64,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ width: 120 }}>
                    {isAdminOrModerator() && (
                        <IconButton
                            color="inherit"
                            sx={{
                                color: "secondary.main",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            <AdminPanelSettingsIcon />
                        </IconButton>
                    )}
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <Box
                        sx={{
                            height: 40,
                            width: 120,
                            backgroundImage: "url(/logo.png)",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}
                    />
                </Box>

                <Box sx={{ width: 120 }}></Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavbar;
