import React from "react";
import { Button, Typography } from "@mui/material";
import styles from "../page.module.css";

const EvidenciaUploader = ({ archivo, setArchivo }) => {
    const handleFileChange = (event) => {
        setArchivo(event.target.files[0]);
    };

    return (
        <>
            <Button
                variant="contained"
                component="label"
                fullWidth
                className={styles.uploadButton}
            >
                Subir Evidencia (Opcional)
                <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Typography variant="body2" className={styles.fileName}>
                {archivo ? archivo.name : "Sin archivo seleccionado"}
            </Typography>
        </>
    );
};

export default EvidenciaUploader;
