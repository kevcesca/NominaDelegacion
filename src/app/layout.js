// src/app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import AuthWrapper from './%Components/Wrapper/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sistema de nomina',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      <body className={inter.className}>
        <AuthProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
