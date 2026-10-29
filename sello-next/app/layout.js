import './globals.css'

const URL_SITIO = 'https://apthapi-ui.vercel.app'

export const metadata = {
  metadataBase: new URL(URL_SITIO),
  title: {
    default: 'Apthapi UI — Componentes de sellos y trámites digitales para Vue y React | Bolivia',
    template: '%s | Apthapi UI',
  },
  description:
    'Librería de componentes boliviana que digitaliza los trámites institucionales: sellos con animación de sellado, recibido con cargo, foliador de expedientes y notificaciones con diseño andino. Para Vue 3 y React.',
  keywords: [
    'apthapi ui',
    'componentes bolivia',
    'sello digital',
    'sello react',
    'sello vue',
    'sellos animados',
    'recibido con cargo',
    'foliador',
    'libreria de componentes',
    'tramites digitales',
    'ui components bolivia',
    'chuspita alert',
    'notificaciones react',
    'notificaciones vue',
  ],
  authors: [{ name: 'Cristhian Leandro Góngora Torrez', url: 'https://www.linkedin.com/in/cristhian-leandro-g%C3%B3ngora-torrez-537496215/' }],
  creator: 'Cristhian Leandro Góngora Torrez',
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    url: URL_SITIO,
    siteName: 'Apthapi UI',
    title: 'Apthapi UI — Sellos y trámites digitales para Vue y React',
    description:
      'La reunión andina de componentes: sellos con animación de sellado, recibido con cargo, foliador y notificaciones con diseño boliviano. Vue 3 y React.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apthapi UI — Sellos y trámites digitales',
    description: 'Componentes de sellos, cargos y folios para Vue 3 y React. Hecho en Bolivia 🇧🇴',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: URL_SITIO },
}

export const viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareLibrary',
    name: 'Apthapi UI',
    description:
      'Librería de componentes para Vue 3 y React que digitaliza trámites institucionales: sellos, recibido con cargo, foliador y notificaciones.',
    url: URL_SITIO,
    applicationCategory: 'DeveloperApplication',
    programmingLanguage: ['JavaScript', 'Vue', 'React'],
    author: {
      '@type': 'Person',
      name: 'Cristhian Leandro Góngora Torrez',
      url: 'https://www.linkedin.com/in/cristhian-leandro-g%C3%B3ngora-torrez-537496215/',
    },
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: 'https://github.com/gongor7/Apthapi-UI',
    keywords: 'sello digital, componentes, vue, react, bolivia, tramites',
  }

  return (
    <html lang="es">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
