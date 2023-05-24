import AppRoutingIndicator from '@/app/AppRoutingIndicator';
import './globals.scss';

export default function RootLayout ({
  children,
  modal,
}: any) {

  return (
    <html lang="en">
    <body>
    {children}
    {modal}
    <AppRoutingIndicator />
    </body>
    </html>
  );
}

