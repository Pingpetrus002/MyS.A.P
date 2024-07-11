import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";

function ButtonSap(args) {
    const [loading, setLoading] = useState(false);
    const [buttonStyle, setButtonStyle] = useState({ variant: "contained" });

    useEffect(() => {
        if (loading) {
            setButtonStyle({ variant: "outlined" });
        } else {
            setButtonStyle({ variant: "contained" });
        }
    }, [loading]);

    const handleClick = async () => {
        setLoading(true);
        try {
            //execute the callback function
            await args.callback(args.props);
        } catch (error) {
            console.error("Error calling ButtonSap callback:", error);
        }
        setLoading(false);
    };

    const { isEditMode } = args;

    return (
        <Button
            variant={buttonStyle.variant}
            color="primary"
            onClick={handleClick}
            sx={{
                backgroundColor: "#FDD47C",
                color: "black",
                borderRadius: "4px",
                width: "10em",
                height: "2em",
                fontSize: "16px",
                fontFamily: "Inter",
                "&:hover": {
                    backgroundColor: "#FFC039",
                    color: "#FFFFFF",
                },
                "&:disabled": {
                    backgroundColor: "#FDD47C",
                    color: "gray",
                },
            }}
            disabled={loading}
        >
            {loading ? (
                <CircularProgress alt="Chargement..." style={{ width: "24px", height: "24px", color: "black" }} />
            ) : (
                isEditMode ? "Modifier" : "Envoyer"
            )}
        </Button>
    );
}

export default ButtonSap;
