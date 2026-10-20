import './globals.css'

export const metadata = {
  title: 'Apthapi UI · Next.js',
  description: 'Colección boliviana de componentes para digitalizar trámites',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav className="nav">
          <a className="nav__marca" href="/">
            🔖 Apthapi UI
          </a>
          <div className="nav__links">
            <a href="/">Inicio</a>
            <a href="/docs">Documentación</a>
            <a href="https://github.com/gongor7/Apthapi-UI" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
