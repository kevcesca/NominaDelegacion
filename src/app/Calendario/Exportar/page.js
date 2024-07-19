'use client';

import React, { useState } from 'react';
import ViewOnlyTable from '../../%Components/ConfigurableTable/ViewOnlyTable';
import styles from './page.module.css';
import data from '../../%Components/ConfigurableTable/data.json'; // Ajusta la ruta según tu estructura de proyecto
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const Page = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    return (
        <main className={styles.main}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                <FormControl>
                    <InputLabel id="year-label">Seleccionar Año</InputLabel>
                    <Select
                        labelId="year-label"
                        value={year}
                        onChange={handleYearChange}
                        displayEmpty
                    >
                        {Object.keys(data).map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <div className={styles.tableContainer}>
                <ViewOnlyTable year={year} data={data[year]} />
            </div>
        </main>
    );
};

export default Page;
