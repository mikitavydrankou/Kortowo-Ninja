import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState } from "react";

const BottomNavbar = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setOpenLogoutDialog(false);
    };

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999,
            }}
        >
            <BottomNavigation showLabels>
                {user
                    ? [
                          <BottomNavigationAction
                              key="profile"
                              component={Link}
                              to="/profile"
                              icon={<InfoIcon />}
                              label="Info"
                          />,
                          <BottomNavigationAction
                              key="home"
                              component={Link}
                              to="/"
                              icon={<HomeIcon />}
                              label="Główna"
                          />,
                          <BottomNavigationAction
                              key="logout"
                              icon={<ExitToAppIcon />}
                              onClick={() => setOpenLogoutDialog(true)}
                              label="Wyloguj się"
                          />,
                      ]
                    : [
                          <BottomNavigationAction
                              key="signin"
                              component={Link}
                              to="/signin"
                              label="Zaloguj się"
                              sx={{
                                  color: "primary.main",
                                  "& .MuiBottomNavigationAction-label": {
                                      fontWeight: "bold",
                                  },
                                  bgcolor: "action.hover",
                                  border: "1px solid",
                                  borderColor: "primary.main",
                                  borderRadius: 2,
                                  mx: 1,
                                  mb: 1,
                                  mt: 1,
                              }}
                          />,
                      ]}
            </BottomNavigation>

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
            >
                <DialogTitle>Potwierdź wylogowanie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz się wylogować?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenLogoutDialog(false)}
                        color="primary"
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                    >
                        Wyloguj
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BottomNavbar;
