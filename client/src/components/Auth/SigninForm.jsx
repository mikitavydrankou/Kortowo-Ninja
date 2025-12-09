import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link as MuiLink,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material";

const SigninForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { signin, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signin(username, password);
            navigate("/");
        } catch (err) {
            console.error("Error signingin:", err);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        height: 80,
                        width: 240,
                        backgroundImage: "url(/logo.png)",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Nickname"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Hasło"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <Alert severity="error">
                            {error.message || JSON.stringify(error)}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{ py: 1.5 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Zaloguj się"
                        )}
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2">
                    Nie masz konta?{" "}
                    <MuiLink
                        component={RouterLink}
                        to="/signup"
                        underline="hover"
                    >
                        Załóż tutaj!
                    </MuiLink>
                </Typography>
                <MuiLink
                    component={RouterLink}
                    to="/"
                    underline="hover"
                    sx={{ mt: 2, display: "block" }}
                >
                    Wróc na główną
                </MuiLink>
            </Box>

        </Box>
    );
};

export default SigninForm;
