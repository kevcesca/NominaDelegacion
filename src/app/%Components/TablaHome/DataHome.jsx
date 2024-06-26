export const ProductService = {
    getProductsData() {
        return [
            {
                "dispositivo": "PC1-Client",
                "ip": "10.26.16.50",
                "descripcion": "Equipo de prueba",
                "recursos": "RAM, DD, CPU",
                "aplicaciones": "HTTP Conexión, HTTP Client, Cache",
                "red": "Inalámbrico, Operativo, Ubicación 1"
            },
            {
                "dispositivo": "PC2-Client",
                "ip": "10.26.16.51",
                "descripcion": "Equipo de desarrollo",
                "recursos": "RAM, DD, CPU",
                "aplicaciones": "HTTP Conexión, HTTP Client, Cache",
                "red": "Cableado, Operativo, Ubicación 2"
            },
            {
                "dispositivo": "PC3-Client",
                "ip": "10.26.16.52",
                "descripcion": "Equipo de soporte",
                "recursos": "RAM, DD, CPU",
                "aplicaciones": "HTTP Conexión, HTTP Client, Cache",
                "red": "Inalámbrico, Operativo, Ubicación 3"
            },
            {
                "dispositivo": "Server1",
                "ip": "10.26.16.100",
                "descripcion": "Servidor principal",
                "recursos": "RAM, DD, CPU",
                "aplicaciones": "HTTP Conexión, HTTP Client, Cache",
                "red": "Cableado, Operativo, Ubicación 4"
            },
            {
                "dispositivo": "Server2",
                "ip": "10.26.16.101",
                "descripcion": "Servidor secundario",
                "recursos": "RAM, DD, CPU",
                "aplicaciones": "HTTP Conexión, HTTP Client, Cache",
                "red": "Cableado, Operativo, Ubicación 5"
            }
        ];
    },

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }
};
