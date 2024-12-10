'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_USERS_URL } from '../../%Config/apiConfig';

const ProtectedComponent = ({ requiredPermissions = [], children, hideIfNoAccess = true }) => {
    const [hasAccess, setHasAccess] = useState(null); // `null` indica que aún no se ha verificado el acceso.
    const router = useRouter();

    useEffect(() => {
        const verifyAccess = async () => {
            try {
                const response = await fetch(`${API_USERS_URL}/verify-permissions`, {
                    credentials: 'include', // Incluye cookies HttpOnly.
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const hasRequiredPermission = requiredPermissions.some(permission =>
                    data.permisos.includes(permission)
                );

                setHasAccess(hasRequiredPermission);

                // Si no se debe ocultar, redirige al usuario sin permisos.
                if (!hasRequiredPermission && !hideIfNoAccess) {
                    router.push('/unauthorized');
                }
            } catch (error) {
                console.error('Error al verificar permisos:', error);
                router.push('/');
            }
        };

        verifyAccess();
    }, [requiredPermissions, hideIfNoAccess, router]);

    // Mientras se verifica el acceso, no renderiza nada.
    if (hasAccess === null) return null;

    // Si no tiene acceso y debe ocultarse, no muestra el contenido.
    if (!hasAccess && hideIfNoAccess) return null;

    return <>{children}</>;
};

export default ProtectedComponent;
