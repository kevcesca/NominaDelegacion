'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useLogo } from '../context/LogoContext';

const UploadLogo = () => {
    const { setLogoUrl } = useLogo();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        try {
            setLoading(true);
            const response = await axios.post(process.env.NEXT_PUBLIC_CLOUDINARY_URL, formData);
            setLogoUrl(response.data.secure_url);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Subir Logo
            </Typography>
            <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Subir'}
            </Button>
        </Box>
    );
};

export default UploadLogo;
