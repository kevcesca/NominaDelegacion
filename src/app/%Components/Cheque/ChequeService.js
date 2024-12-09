// src/app/%Components/TotalCLCsTable/ChequeService.js

export const ChequeService = {
    generateChequesData() {
        const cheques = [];
        for (let i = 0; i < 80; i++) {
            cheques.push({
                polizaNo: `536${i}`,
                noDe: `10834${i}`,
                noEmpleado: 1168954 + i,
                nombreBeneficiario: `Beneficiario ${i + 1}`,
                importe: (2500 + (i * 10)).toFixed(2),
                conceptoPago: `2da. Qna. Abril 2024`,
                rfc: "VALP",
                tipoNomina: "1",
                percepciones: (3000 + (i * 10)).toFixed(2),
                deducciones: 500.00,
                liquido: (2500 + (i * 10)).toFixed(2),
                fecha: "15/04/2024",
                estado: "No entregado" // Estado por defecto
            });
        }
        return cheques;
    },

    getCheques() {
        return Promise.resolve(this.generateChequesData());
    }
};
