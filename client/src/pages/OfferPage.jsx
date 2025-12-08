import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useOfferById } from "../api/offerQueries";
import BackButton from "../components/buttons/BackButton";
import { DeleteButton } from "../components/buttons/DeleteOfferButton";
import { useAuthStore } from "../store/authStore";
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
    Stack
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

const OfferPage = () => {
    const { id } = useParams();
    const { data: offer, isLoading, error } = useOfferById(id);
    const { user } = useAuthStore();

    const [openTerms, setOpenTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleAcceptTerms = () => {
        setAcceptedTerms(true);
        setOpenTerms(false);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <p>Błąd: {error.message}</p>;
    if (!offer) return <p>Oferta nie została znaleziona</p>;

    const isOwner = user?.id === offer.user.id;
    const isAdminOrModerator = user?.role === "admin" || user?.role === "moderator";
    const canDelete = isOwner || isAdminOrModerator;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <BackButton />

            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {offer.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {offer.place} • {offer.user?.username}
                </Typography>

                {offer.description && (
                    <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                        {offer.description}
                    </Typography>
                )}

                <Box sx={{ mb: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        W ZAMIAN CHCĘ:
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
                        {offer.counter_offer || "Otwarte na propozycje"}
                    </Typography>
                </Box>

                {!acceptedTerms ? (
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => setOpenTerms(true)}
                        sx={{ py: 1.5, borderRadius: 2 }}
                    >
                        Skontaktuj się
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<FacebookIcon />}
                        href={offer.user?.link}
                        target="_blank"
                        sx={{ py: 1.5, borderRadius: 2, bgcolor: '#1877F2' }}
                    >
                        Napisz na Facebooku
                    </Button>
                )}

                {canDelete && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <DeleteButton offerId={offer.id} />
                    </Box>
                )}
            </Box>

            <Dialog open={openTerms} onClose={() => setOpenTerms(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Regulamin Kortowo Ninja</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Zaktualizowano: 15.05.2025
                    </Typography>
                    <Typography paragraph>
                        Przed skontaktowaniem się z autorem oferty prosimy o uważne zapoznanie się z regulaminem:
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Korzystanie z platformy
                    </Typography>
                    <Typography paragraph>
                        Kortowo Ninja to bezpłatna platforma do wymiany rzeczy między studentami...
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Odpowiedzialność
                    </Typography>
                    <Typography paragraph>
                        Kortowo Ninja udostępnia jedynie narzędzie do zamieszczania ogłoszeń i nie bierze udziału w wymianie przedmiotów między użytkownikami. Wszystkie ustalenia, spotkania i przekazania przedmiotów odbywają się poza platformą — na własną odpowiedzialność użytkowników. Administracja nie ponosi odpowiedzialności za skutki takich interakcji, w tym ewentualne spory, oszustwa lub niewywiązanie się z ustaleń.
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Zakazane treści
                    </Typography>
                    <ul>
                        <li>Alkohol dla osób poniżej 18 roku życia</li>
                        <li>Przemoc, dyskryminacja, spam, oszustwa</li>
                        <li>Nielegalne przedmioty</li>
                        <li>Reklama bez zgody</li>
                    </ul>
                    <FormControlLabel
                        control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />}
                        label="Akceptuję regulamin Kortowo Ninja"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTerms(false)}>Anuluj</Button>
                    <Button onClick={handleAcceptTerms} disabled={!acceptedTerms} variant="contained">
                        Dalej
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OfferPage;
