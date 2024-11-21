import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { username, password } = await request.json();

    try {
        const response = await axios.post(
            `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
            new URLSearchParams({
                grant_type: 'password',
                client_id: process.env.KEYCLOAK_CLIENT_ID,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
                username,
                password,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token, refresh_token, id_token } = response.data;
        return NextResponse.json({ access_token, refresh_token, id_token });
    } catch (error) {
        console.error('Error logging in to Keycloak:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Invalid username or password', details: error.response?.data || error.message },
            { status: 401 }
        );
    }
}
