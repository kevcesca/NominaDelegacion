// src/app/%Services/UserService.js
export async function fetchUsersFromKeycloak() {
    const realm = 'reino-NominaAzcapo'; // Reemplaza con el nombre de tu realm
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
    const tokenUrl = `http://localhost:8081/realms/${realm}/protocol/openid-connect/token`;
    const usersUrl = `http://localhost:8081/admin/realms/${realm}/users`;

    // Paso 1: Obtener el token de acceso
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': clientId,
            'client_secret': clientSecret,
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error('Error fetching access token from Keycloak');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Paso 2: Obtener la lista de usuarios
    const usersResponse = await fetch(usersUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!usersResponse.ok) {
        throw new Error('Error fetching users from Keycloak');
    }

    return await usersResponse.json();
}
