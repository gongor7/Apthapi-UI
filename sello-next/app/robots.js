const URL_SITIO = 'https://apthapi-ui.vercel.app'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${URL_SITIO}/sitemap.xml`,
  }
}
