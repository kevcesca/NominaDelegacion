export const DataService = {
    getData: async () => {
        // Aquí iría la llamada real a la API cuando esté disponible.
        // const response = await fetch('https://api.example.com/data');
        // return response.json();

        // Placeholder con datos simulados
        return [
            {
                id: 1,
                fecha_op: '2023-04-17',
                fecha_val: '2023-04-17',
                monto: 83190,
                codigo: 439,
                descrp: 'Pago Cheque Propio MN.:0086251',
                cheque: '86251',
                cargo: 4176.5,
                abono: 0,
                saldo: 2938019.82
            },
            // Agregar más objetos de datos aquí según sea necesario
        ];
    }
};
