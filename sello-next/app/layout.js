import './globals.css'

export const metadata = {
  title: 'Apthapi UI · Next.js',
  description: 'Colección boliviana de componentes para digitalizar trámites',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
