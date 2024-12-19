"use client";

import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChequeManagementForm from "./ChequeManagementForm";
import ChequeTable from "./ChequeTable";
import useChequeTable from "./useChequeTable";

export default function Repos() {
    const { cheques, fetchCheques } = useChequeTable();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ChequeManagementForm onSearch={fetchCheques} />
            <ChequeTable cheques={cheques} />
        </LocalizationProvider>
    );
}
