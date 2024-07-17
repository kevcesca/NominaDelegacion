export const ChequeService = {
    getChequesData() {
        return [
            {
                polizaNo: "5360",
                noDe: "108345",
                noEmpleado: 1168954,
                nombreBeneficiario: "Juan Perez",
                importe: 2958.35,
                conceptoPago: "2da. Qna. Abril 2024",
                rfc: "VALP",
                tipoNomina: "1",
                percepciones: 3463.93,
                deducciones: 505.58,
                liquido: 2958.35,
                fecha: "15/04/2024",
                estado: "No entregado" // Estado por defecto
            },
            {
                polizaNo: "5361",
                noDe: "108346",
                noEmpleado: 1168955,
                nombreBeneficiario: "Maria Lopez",
                importe: 2500.00,
                conceptoPago: "2da. Qna. Abril 2024",
                rfc: "VALP",
                tipoNomina: "1",
                percepciones: 3000.00,
                deducciones: 500.00,
                liquido: 2500.00,
                fecha: "15/04/2024",
                estado: "No entregado" // Estado por defecto
            }
        ];
    },

    getCheques() {
        return Promise.resolve(this.getChequesData());
    },

    actualizarEstado(noEmpleado, nuevoEstado) {
        const cheques = this.getChequesData();
        const cheque = cheques.find(chq => chq.noEmpleado === noEmpleado);
        if (cheque) {
            cheque.estado = nuevoEstado;
        }
        return Promise.resolve(cheques);
    }
};
