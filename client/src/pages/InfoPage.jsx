import {
    Container,
    Box,
    Typography,
    Stack,
    Divider,
    Chip,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LinkIcon from "@mui/icons-material/Link";
import GavelIcon from "@mui/icons-material/Gavel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getUserCount, getOfferCount } from "../api/featureAPI.js";
import { deleteAccount } from "../api/authAPI.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

const InfoPage = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(null);
    const [offerCount, setOfferCount] = useState(null);
    const [termsOpen, setTermsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [users, offers] = await Promise.all([
                    getUserCount(),
                    getOfferCount(),
                ]);
                setUserCount(users);
                setOfferCount(offers);
            } catch (err) {
                console.error("Failed to fetch counts", err);
            }
        };

        fetchCounts();
    }, []);

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "USUŃ") return;
        setDeleting(true);
        try {
            await deleteAccount();
            logout();
            navigate("/");
        } catch (err) {
            console.error("Failed to delete account", err);
        }
        setDeleting(false);
    };

    const sectionStyle = {
        p: 4,
        mb: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    Witamy w Ninja!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Platforma wymiany
                </Typography>
            </Box>

            {user && (
                <Box sx={sectionStyle}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                                {user.username?.charAt(0).toUpperCase()}
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={600}>
                                {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.createdAt
                                    ? `Dołączył ${new Date(user.createdAt).toLocaleDateString("pl-PL")}`
                                    : "Użytkownik"}
                            </Typography>
                            {user.link && (
                                <Typography
                                    component="a"
                                    href={user.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="body2"
                                    sx={{
                                        color: "primary.main",
                                        textDecoration: "none",
                                        display: "block",
                                        mt: 0.5,
                                        "&:hover": { textDecoration: "underline" },
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user.link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}

            <Box sx={sectionStyle}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <SwapHorizIcon color="primary" /> O projekcie
                </Typography>
                <Typography
                    paragraph
                    sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                    Ninja to projekt stworzony przez studenta informatyki
                    Uniwersytetu Warmińsko-Mazurskiego. Ma na celu ułatwienie
                    wymiany rzeczy i usług między studentami, zwłaszcza tymi
                    mieszkającymi w akademikach Kortowa.
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                    }}
                >
                    {userCount === null ? (
                        <CircularProgress size={24} color="primary" />
                    ) : (
                        <>
                            <PersonIcon color="primary" />
                            <Typography variant="body1" fontWeight={500}>
                                Już {userCount} zarejestrowanych użytkowników!
                            </Typography>
                        </>
                    )}
                </Box>
                <br />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                    }}
                >
                    {offerCount === null ? (
                        <CircularProgress size={24} color="primary" />
                    ) : (
                        <>
                            <AssignmentIcon color="primary" />
                            <Typography variant="body1" fontWeight={500}>
                                Łącznie utworzono {offerCount} ofert!
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>

            <Box sx={sectionStyle}>
                <Box
                    sx={{
                        display: "grid",
                        gap: 4,
                        gridTemplateColumns: { md: "repeat(3, 1fr)" },
                    }}
                >
                    {[
                        {
                            title: "1. Dodaj ofertę",
                            content: "Opisz przedmiot i ustaw timer",
                        },
                        {
                            title: "2. Przeglądaj",
                            content: "Znajdź potrzebne przedmioty",
                        },
                        {
                            title: "3. Wymieniaj się",
                            content: "Skontaktuj się przez Facebook",
                        },
                    ].map((step) => (
                        <Box key={step.title} sx={{ textAlign: "center" }}>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    bgcolor: "primary.main",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                {step.title[0]}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {step.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {step.content}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={sectionStyle}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <ContactSupportIcon color="primary" /> Kontakt
                </Typography>

                <Stack spacing={3}>
                    <Button
                        variant="contained"
                        href="https://docs.google.com/forms/d/e/1FAIpQLSd2maOG4HMX7UiaBmdkkTLLOBJ4-8bPbeiSVFOQ7cUiYk6C6Q/viewform"
                        target="_blank"
                        startIcon={<EmailIcon />}
                        sx={{ py: 1.5, borderRadius: 3 }}
                    >
                        Formularz kontaktowy
                    </Button>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "action.hover",
                        }}
                    >
                        <EmailIcon color="primary" />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Email bezpośredni:
                            </Typography>
                            <Typography variant="body1">
                                <a
                                    href="mailto:hausmojo@outlook.com"
                                    style={{ textDecoration: "none" }}
                                >
                                    hausmojo@outlook.com
                                </a>
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<GavelIcon />}
                        onClick={() => setTermsOpen(true)}
                        sx={{ borderRadius: 3 }}
                    >
                        Pokaż regulamin
                    </Button>
                </Stack>
            </Box>

            <Dialog
                open={termsOpen}
                onClose={() => setTermsOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    <GavelIcon color="primary" /> Regulamin Kortowo Ninja
                </DialogTitle>
                <DialogContent dividers>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Zaktualizowano: {new Date().getFullYear()}
                    </Typography>

                    <Typography paragraph>
                        Przed korzystaniem z platformy prosimy o uważne
                        zapoznanie się z warunkami:
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
                    <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
                        <li>Napoje alkoholowe osobom poniżej 18 roku życia</li>
                        <li>Przemoc, dyskryminację, spam, oszustwa</li>
                        <li>Fałszywe lub wprowadzające w błąd informacje</li>
                        <li>Przedmioty zabronione prawem</li>
                        <li>Reklamę komercyjną bez zgody administracji</li>
                    </Box>

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
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setTermsOpen(false)}
                        variant="contained"
                    >
                        Zamknij
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeleteConfirm("");
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: "error.main" }}>
                    <DeleteForeverIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Usuń konto
                </DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        Ta operacja jest <strong>nieodwracalna</strong>. Wszystkie Twoje
                        oferty zostaną usunięte.
                    </Typography>
                    <Typography paragraph>
                        Aby potwierdzić, wpisz <strong>USUŃ</strong> poniżej:
                    </Typography>
                    <TextField
                        fullWidth
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="USUŃ"
                        variant="outlined"
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setDeleteConfirm("");
                        }}
                    >
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        variant="contained"
                        color="error"
                        disabled={deleteConfirm !== "USUŃ" || deleting}
                    >
                        {deleting ? <CircularProgress size={20} /> : "Usuń konto"}
                    </Button>
                </DialogActions>
            </Dialog>

            {user && (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => setDeleteOpen(true)}
                        sx={{ borderRadius: 3, opacity: 0.7 }}
                    >
                        Usuń konto
                    </Button>
                </Box>
            )}

            <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 4, opacity: 0.8 }}
            >
                © {new Date().getFullYear()} Ninja | Projekt studencki WMiI
            </Typography>
        </Container>
    );
};

export default InfoPage;
