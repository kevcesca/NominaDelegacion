import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: 'password',
              client_id: process.env.KEYCLOAK_CLIENT_ID,
              client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
              username: credentials.email,
              password: credentials.password
            })
          });

          const user = await res.json();

          if (res.ok && user) {
            // Decodificar el access_token para obtener los roles del usuario
            const decodedToken = JSON.parse(Buffer.from(user.access_token.split('.')[1], 'base64').toString());

            return {
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
              idToken: user.id_token,
              roles: decodedToken.realm_access?.roles || [], // Extraer roles del token decodificado
              name: user.name || credentials.email.split('@')[0],
              email: credentials.email,
            };
          }
          return null;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    }),
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.idToken = user.idToken;
        token.name = user.name;
        token.email = user.email;
        token.roles = user.roles || []; // Añadir roles al token JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.idToken = token.idToken;
      session.user.name = token.name;
      session.user.email = token.email;
      session.roles = token.roles || []; // Pasar los roles a la sesión
      return session;
    }
  }
});

export { handler as GET, handler as POST };
