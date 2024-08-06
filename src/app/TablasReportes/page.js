// src/app/TotalConceptos/page.js
'use client';
import React from 'react';
import TotalConceptosTable from '../%Components/TotalConceptosTable/TotalConceptosTable';
import TotalCLCsTable from '../%Components/TotalCLCsTable/TotalCLCsTable'

const Page = () => {
    return (
        <main>
            <h1>Tablas Reportes</h1>
            <TotalConceptosTable />
            <TotalCLCsTable />
        </main>
    );
};

export default Page;