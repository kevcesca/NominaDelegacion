import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/Login',
    },
});

export const config = { matcher: ['/Calendario', '/CambioContra', '/CargarLogo', '/context', '/CrearNomina', '/GenerarCheque', '/Perfil', '/Reportes', '/SubirEvidencia', '/Usuarios', '/Validacion'] };
