// src/app/%Components/UserService.js

export const UserService = {
    getComparativaData() {
        return Promise.resolve([
            { key: '1', anio: 2021, quincena: '01', tipo_nomina: 'Base', usuario: 'usuario1', fecha_carga: '2021-01-15', deducciones: 100, prestaciones: 200, liquido: 300, status: 'Aprobar' },
            { key: '2', anio: 2021, quincena: '02', tipo_nomina: 'Estructura', usuario: 'usuario2', fecha_carga: '2021-02-15', deducciones: 150, prestaciones: 250, liquido: 350, status: 'Cancelar' },
            // Añade más registros según sea necesario
        ]);
    }
};
