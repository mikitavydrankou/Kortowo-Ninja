import { useDeleteOffer } from "../../api/offerQueries";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export const DeleteButton = ({ offerId }) => {
    const { mutate: deleteOffer, isLoading } = useDeleteOffer();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleConfirmDelete = () => {
        deleteOffer(offerId, {
            onSuccess: () => {
                setOpen(false);
                navigate("/");
            },
        });
    };

    return (
        <>
            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpen(true)}
                disabled={isLoading}
                sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    flexGrow: 1,
                    "&:hover": {
                        backgroundColor: "error.dark",
                        boxShadow: 2,
                    },
                }}
            >
                {isLoading ? "Usuwanie..." : "Usuń ofertę"}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Potwierdź usunięcie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć tę ofertę? Tej operacji nie
                        można cofnąć.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? "Usuwanie..." : "Usuń"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
