import { Inter } from 'next/font/google';
import './globals.css';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { AuthProvider } from './context/AuthContext';
import AuthWrapper from './%Components/Wrapper/AuthWrapper';
import SessionProviderWrapper from './%Components/Wrapper/SessionProviderWrapper';
import { AlertProvider } from './context/AlertContext';
import AlertWrapper from './%Components/Wrapper/AlertWrapper'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sistema de nomina',
  description: 'Sistema de nómina para la alcaldía Azcapotzalco',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <AuthProvider>
            <AlertProvider>
              <AuthWrapper>
                <AlertWrapper>{children}</AlertWrapper>
              </AuthWrapper>
            </AlertProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
