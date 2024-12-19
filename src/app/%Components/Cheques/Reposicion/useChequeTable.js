import { useState } from "react";
import API_BASE_URL from "../../../%Config/apiConfig";

export default function useChequeTable() {
    const [cheques, setCheques] = useState([]);

    const fetchCheques = async (filters) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/buscarCheques?fecha=${filters.fecha}&quincena=${filters.quincena}&anio=${filters.anio}&tipo_nomina=${filters.tipoNomina}`
            );
            const data = await response.json();
            setCheques(data);
        } catch (error) {
            console.error("Error al buscar cheques:", error);
        }
    };

    return { cheques, fetchCheques };
}
