import {
    Container,
    TextField,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    Link as MuiLink,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useCreateOffer } from "../../api/offerQueries";

const OfferForm = () => {
    const [formData, setFormData] = useState({
        place: "",
        title: "",
        description: "",
        ttlHours: "",
        counter_offer: "",
        agreeToRules: false,
    });

    const [openRules, setOpenRules] = useState(false);

    const LIMITS = {
        title: 20,
        description: 100,
        counter_offer: 40,
    };

    const { mutate, isPending, isError, error, isSuccess } = useCreateOffer();

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
            return;
        }

        if (name === "title" && value.length > LIMITS.title) return;
        if (name === "description" && value.length > LIMITS.description) return;
        if (name === "counter_offer" && value.length > LIMITS.counter_offer)
            return;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.agreeToRules}
                        onChange={handleChange}
                        name="agreeToRules"
                        color="primary"
                    />
                }
                label={
                    <>
                        Potwierdzam, że moja oferta jest zgodna z{" "}
                        <MuiLink
                            component="button"
                            variant="body2"
                            onClick={() => setOpenRules(true)}
                            sx={{ cursor: "pointer" }}
                        >
                            regulaminem Kortowo Ninja
                        </MuiLink>{" "}
                        i nie zawiera treści zabronionych.
                    </>
                }
            />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mt: 2,
                    gap: 2,
                }}
            >
                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            px: 1,
                            mb: 0,
                        }}
                    >
                        Wybierz akademik, albo miejsce obok
                    </Typography>
                    <Select
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        required
                        displayEmpty
                        fullWidth
                    >
                        <MenuItem value="" disabled>
                            Wybierz akademik
                        </MenuItem>
                        {[
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
                        ].map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            px: 1,
                            mb: 1,
                        }}
                    >
                        Tytuł będzie widoczny na karcie oferty
                    </Typography>
                    <TextField
                        name="title"
                        label="Co chcesz wymienić?"
                        placeholder="np. Książka, laptop, stół"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{ maxLength: LIMITS.title }}
                        helperText={`${formData.title.length}/${LIMITS.title}`}
                    />
                </Box>

                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            px: 1,
                            mb: 1,
                        }}
                    >
                        Napisz dobry opis, aby przyciągnąć uwagę innych
                        użytkowników.
                    </Typography>
                    <TextField
                        name="description"
                        label="Opis"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        multiline
                        rows={3}
                        fullWidth
                        inputProps={{ maxLength: LIMITS.description }}
                        helperText={`${formData.description.length}/${LIMITS.description}`}
                    />
                </Box>

                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            px: 1,
                            mb: 1,
                        }}
                    >
                        Maksymalna ilość godzin to 48. Po tym czasie oferta
                        zostanie zarchiwizowana.
                    </Typography>
                    <TextField
                        type="number"
                        name="ttlHours"
                        label="Czas trwania (w godzinach)"
                        value={formData.ttlHours}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{
                            min: 1,
                            max: 48,
                            step: 1,
                        }}
                    />
                </Box>

                <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            px: 1,
                            mb: 1,
                        }}
                    >
                        Jak nie wiesz co chcesz, napisz n.p. "Czekam na
                        propozycje"
                    </Typography>
                    <TextField
                        name="counter_offer"
                        label="Co ty chciałbyś w zamian?"
                        value={formData.counter_offer}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{ maxLength: LIMITS.counter_offer }}
                        helperText={`${formData.counter_offer.length}/${LIMITS.counter_offer}`}
                    />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending || !formData.agreeToRules}
                    size="large"
                    sx={{ mt: 1 }}
                >
                    {isPending ? "Wysyłanie..." : "Wyślij"}
                </Button>

                {isError && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        Błąd: {error.response?.data?.message || error.message}
                    </Typography>
                )}

                {isSuccess && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                        Oferta została pomyślnie dodana!
                    </Typography>
                )}
            </Box>

            <Dialog
                open={openRules}
                onClose={() => setOpenRules(false)}
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
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenRules(false)}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OfferForm;
