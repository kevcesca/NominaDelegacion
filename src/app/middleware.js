// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/Login',
        error: '/Login', // Display the login page on error
    },
    callbacks: {
        async authorized({ req, token }) {
            const { pathname } = req.nextUrl;
            // Allow public routes without authentication
            if (pathname.startsWith('/RecuperarContra') || pathname.startsWith('/Registrarse') || pathname.startsWith('/Login')) {
                return true;
            }
            // Require authentication for other routes
            return !!token;
        },
    },
});

export const config = { matcher: ['/Calendario', '/CambioContra', '/CargarLogo', '/context', '/CrearNomina', '/GenerarCheque', '/Perfil', '/Reportes', '/SubirEvidencia', '/Usuarios', '/Validacion'] };
