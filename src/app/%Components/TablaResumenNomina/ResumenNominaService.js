export const ResumenNominaService = {
    getArchivos() {
        return Promise.resolve([
            { nombreArchivo: '52-ResumenNom.xlsx', fechaCarga: '12-04-2024', identificadorDatos: 'RESUMEN, BASE, ESTRUCTURA, EXTRAORDINARIOS' },
            { nombreArchivo: '52-ResumenNomTn8.xlsx', fechaCarga: '-', identificadorDatos: 'RESUMEN DE NOMINA 8' },
            { nombreArchivo: '52-ResumenNomFin.xlsx', fechaCarga: '-', identificadorDatos: 'RESUMEN DE NOMINA FINIQUITO' }
        ]);
    }
};