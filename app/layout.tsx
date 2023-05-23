import './globals.css';

export default function RootLayout ({
  children,
  modal,
}: any) {

  return (
    <html lang="en">
    <body>
    {children}
    {modal}
    </body>
    </html>
  );
}

