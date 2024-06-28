export const ProductService = {
    getUsuariosData() {
        return [
            {
                "acciones": "...",
                "id": 1,
                "fechaAlta": "10-04-2024",
                "nombre": "HECTOR",
                "apellidos": "CHAVEZ MIRANDA",
                "email": "control.personal@azcapotzalco.cdmx.gob.mx",
                "activo": "SI"
            },
            {
                "acciones": "...",
                "id": 2,
                "fechaAlta": "10-04-2024",
                "nombre": "LIZETH",
                "apellidos": "RUIZ HÉRNANDEZ",
                "email": "administracion.personal@azcapotzalco.cdmx.gob.mx",
                "activo": "SI"
            },
            {
                "acciones": "...",
                "id": 3,
                "fechaAlta": "10-04-2024",
                "nombre": "FRANCISCO",
                "apellidos": "MATA VELASCO",
                "email": "fcomatvel@hotmail.com",
                "activo": "SI"
            }
        ];
    },

    getUsuariosMini() {
        return Promise.resolve(this.getUsuariosData().slice(0, 1));
    },

    getUsuariosSmall() {
        return Promise.resolve(this.getUsuariosData().slice(0, 2));
    },

    getUsuarios() {
        return Promise.resolve(this.getUsuariosData());
    }
};
