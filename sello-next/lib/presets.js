// Imágenes de ejemplo (SVG en data-URI) para probar SelloImagen.
// Cualquier URL de imagen también sirve, siempre que permita hotlink/CORS.
const svg = (path, vb = 24) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}">${path}</svg>`
  )}`

export const PRESETS = [
  {
    nombre: 'Estrella',
    imagen: svg(
      '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="#000"/>'
    ),
  },
  {
    nombre: 'Check',
    imagen: svg('<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  },
  {
    nombre: 'Corazón',
    imagen: svg(
      '<path d="M12 21s-8.4-5.4-10.3-10C.4 7.6 2.6 4 6.2 4c2.3 0 4 1.3 5.8 3.4C13.8 5.3 15.5 4 17.8 4c3.6 0 5.8 3.6 4.5 7-1.9 4.6-10.3 10-10.3 10z" fill="#000"/>'
    ),
  },
  {
    nombre: 'Rayo',
    imagen: svg('<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#000"/>'),
  },
  {
    nombre: 'Avión',
    imagen: svg(
      '<path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#000"/>'
    ),
  },
]
