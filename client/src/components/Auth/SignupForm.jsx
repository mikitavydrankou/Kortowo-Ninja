import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link as MuiLink,
    Stack,
    CircularProgress,
    Alert,
    useMediaQuery,
    useTheme,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [link, setLink] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [openTerms, setOpenTerms] = useState(false);

    const { signup, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedTerms) return;
        try {
            await signup(username, link, password);
            navigate("/");
        } catch (err) {
            console.error("Error signing up:", err);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Załóż konto!
            </Typography>

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
                    <Alert severity="error" sx={{ fontSize: "0.85rem" }}>
                        Pamiętaj, aby twój profil był publiczny. Możesz to
                        zrobić w ustawieniach prywatności swojego profilu.
                    </Alert>

                    <TextField
                        fullWidth
                        label="Link do strony profilu Facebook"
                        variant="outlined"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        helperText="Przykład: https://www.facebook.com/profile.php?id=1000812212993440"
                        required
                    />

                    {isDesktop ? (
                        <Button
                            href={"https://www.facebook.com/profile.php"}
                            target="_blank"
                            variant="outlined"
                            sx={{ mt: 1 }}
                            fullWidth
                        >
                            Tutaj znajdziesz swój link
                        </Button>
                    ) : (
                        <Alert
                            severity="error"
                            sx={{ fontSize: "0.85rem", whiteSpace: "pre-wrap" }}
                        >
                            <strong>Jak znaleźć link do profilu:</strong>
                            {"\n"}1. Otwórz aplikację Facebooka
                            {"\n"}2. Przejdź do swojego profilu
                            {"\n"}3. Kliknij trzy kropki obok „Edytuj profil”
                            {"\n"}4. Na dole wybierz „Kopiuj link do profilu”
                            {"\n"}5. Wróć na stronę i wklej go powyżej
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Hasło"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={acceptedTerms}
                                onChange={(e) =>
                                    setAcceptedTerms(e.target.checked)
                                }
                                name="acceptedTerms"
                                color="primary"
                            />
                        }
                        label={
                            <>
                                Akceptuję{" "}
                                <MuiLink
                                    component="span"
                                    variant="body2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpenTerms(true);
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Regulamin Kortowo Ninja
                                </MuiLink>
                            </>
                        }
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading || !acceptedTerms}
                        sx={{ py: 1.5 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Załóż konto"
                        )}
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2">
                    Masz konto?{" "}
                    <MuiLink component={Link} to="/signin" underline="hover">
                        Załoguj się tutaj!
                    </MuiLink>
                </Typography>
                <MuiLink
                    component={Link}
                    to="/"
                    underline="hover"
                    sx={{ mt: 2, display: "block" }}
                >
                    Wróć na stronę główną
                </MuiLink>
            </Box>

            <Dialog
                open={openTerms}
                onClose={() => setOpenTerms(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Regulamin Kortowo Ninja</DialogTitle>
                <DialogContent dividers>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Zaktualizowano: 15.05.2025
                    </Typography>

                    <Typography paragraph>
                        Przed utworzeniem konta prosimy o uważne zapoznanie się
                        z warunkami:
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Korzystanie z platformy
                    </Typography>
                    <Typography paragraph>
                        Kortowo Ninja to bezpłatna platforma do wymiany rzeczy
                        między studentami. Platforma udostępnia narzędzie
                        techniczne do zamieszczania ofert i nie pośredniczy w
                        transakcjach.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Odpowiedzialność
                    </Typography>
                    <Typography paragraph>
                        Potwierdzasz, że korzystasz z serwisu dobrowolnie i
                        ponosisz pełną odpowiedzialność za swoje działania,
                        informacje, które zamieszczasz oraz za efekty wymiany z
                        innymi użytkownikami. Platforma i jej administratorzy
                        nie ponoszą odpowiedzialności za jakiekolwiek straty,
                        spory lub szkody.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Zasady zamieszczania treści
                    </Typography>
                    <Typography paragraph>
                        Zabrania się zamieszczania ofert zawierających:
                    </Typography>
                    <ul>
                        <li>napoje alkoholowe osobom poniżej 18 roku życia;</li>
                        <li>przemoc, dyskryminację, spam, oszustwa;</li>
                        <li>fałszywe lub wprowadzające w błąd informacje;</li>
                        <li>
                            przedmioty zabronione prawem (narkotyki, broń, leki
                            na receptę);
                        </li>
                        <li>reklamę komercyjną bez zgody administracji.</li>
                    </ul>

                    <Typography variant="subtitle1" gutterBottom>
                        Moderacja
                    </Typography>
                    <Typography paragraph>
                        Administracja platformy zastrzega sobie prawo do
                        usuwania dowolnych treści oraz blokowania kont za
                        naruszenie zasad bez wcześniejszego powiadomienia.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Dane osobowe
                    </Typography>
                    <Typography paragraph>
                        Dobrowolnie udostępniasz informacje (np. link do mediów
                        społecznościowych) publicznie. Platforma nie odpowiada
                        za wykorzystanie tych danych przez osoby trzecie.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Akceptacja warunków
                    </Typography>
                    <Typography paragraph>
                        Rejestrując się, potwierdzasz, że zapoznałeś(-aś) się z
                        regulaminem, rozumiesz i akceptujesz wszystkie jego
                        warunki oraz zgadzasz się ponosić pełną odpowiedzialność
                        za korzystanie z konta i zamieszczane treści.
                    </Typography>

                    <Typography paragraph>
                        Jeśli nie zgadzasz się z tymi warunkami, prosimy nie
                        rejestrować się i nie korzystać z platformy.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenTerms(false)}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SignupForm;
