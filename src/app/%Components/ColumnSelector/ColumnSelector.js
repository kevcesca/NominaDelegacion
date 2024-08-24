import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './ColumnSelector.module.css'

const ColumnSelector = ({ availableColumns, onSelectionChange }) => {
    const theme = useTheme(); // Accede al tema configurado
    const initialSelection = availableColumns.reduce((acc, column) => {
        acc[column.key] = column.defaultSelected || false;
        return acc;
    }, {});

    const [selectedColumns, setSelectedColumns] = useState(initialSelection);

    const handleCheckboxChange = (event) => {
        setSelectedColumns({
            ...selectedColumns,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSubmit = () => {
        onSelectionChange(selectedColumns);
    };

    return (
        <Box 
            sx={{ 
                marginBottom: 2, 
                padding: 2, 
                border: `1px solid ${theme.palette.primary.main}`, 
                borderRadius: '4px',
                backgroundColor: theme.palette.background.paper,
            }} 
            className={styles.container}
        >
            <Typography variant="h6" color="primary">
                Campos para generar tabla
            </Typography>
            <FormGroup row sx={{ color: theme.palette.text.primary }}>
                {availableColumns.map((column) => (
                    <FormControlLabel
                        key={column.key}
                        control={
                            <Checkbox
                                checked={selectedColumns[column.key]}
                                onChange={handleCheckboxChange}
                                name={column.key}
                                sx={{
                                    color: theme.palette.primary.main,
                                    '&.Mui-checked': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            />
                        }
                        label={column.label}
                    />
                ))}
            </FormGroup>
            <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                }}
            >
                Generar tabla
            </Button>
        </Box>
    );
};

export default ColumnSelector;
