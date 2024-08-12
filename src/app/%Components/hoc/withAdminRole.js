import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function withAdminRole(Component) {
    return function RoleProtectedComponent(props) {
        const { data: session, status } = useSession();

        if (status === 'loading') {
            return <div>Loading...</div>;
        }

        if (!session || !session.roles.includes('Admin')) {
            redirect('/unauthorized');  // Redirigir a la página de acceso denegado
            return null;
        }

        return <Component {...props} />;
    };
}
