const URL_SITIO = 'https://apthapi-ui.vercel.app'

export default function sitemap() {
  return [
    {
      url: URL_SITIO,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${URL_SITIO}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
