'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './sello.css'

const SALPICADURAS = [
  { x: -6, y: 8, s: 0.1, d: 0.3 },
  { x: 102, y: 12, s: 0.07, d: 0.36 },
  { x: -10, y: 88, s: 0.08, d: 0.42 },
  { x: 98, y: 92, s: 0.12, d: 0.26 },
]

/**
 * Sello de imagen: recibe una imagen, la tiñe del color elegido
 * y la sella con la animación de impacto.
 *
 * @param {object} props
 * @param {string}  props.imagen              URL o data-URI de la imagen
 * @param {number}  [props.tamano=180]        Tamaño en píxeles
 * @param {string}  [props.color='#dc2626']   Color de tinta para teñir la imagen
 * @param {'circular'|'rectangular'} [props.forma='circular']
 * @param {number}  [props.inclinacion=-12]   Inclinación en grados
 * @param {number}  [props.escala=0.6]        Escala de la imagen dentro del sello (0-1)
 * @param {boolean} [props.quitarFondo=true]  Lo claro se vuelve transparente; queda solo la tinta
 * @param {number}  [props.estampar=0]        Cambia su valor para disparar un sellado
 * @param {() => void} [props.onSellado]      Callback al sellar
 */
export default function SelloImagen({
  imagen,
  tamano = 180,
  color = '#dc2626',
  forma = 'circular',
  inclinacion = -12,
  escala = 0.6,
  quitarFondo = true,
  estampar = 0,
  onSellado,
}) {
  const [estampando, setEstampando] = useState(false)
  const timer = useRef(null)
  const refEstampar = useRef(estampar)
  const refOnSellado = useRef(onSellado)
  const uid = useMemo(() => `si-${Math.random().toString(36).slice(2, 8)}`, [])

  const sellar = useCallback(() => {
    clearTimeout(timer.current)
    setEstampando(false)
    requestAnimationFrame(() => {
      setEstampando(true)
      refOnSellado.current?.()
      timer.current = setTimeout(() => setEstampando(false), 800)
    })
  }, [])

  useEffect(() => {
    refOnSellado.current = onSellado
  }, [onSellado])

  useEffect(() => {
    sellar()
    return () => clearTimeout(timer.current)
  }, [sellar])

  useEffect(() => {
    if (estampar !== refEstampar.current) {
      refEstampar.current = estampar
      sellar()
    }
  }, [estampar, sellar])

  // descompone el color hex y arma las matrices de tinte
  const { matrizTinte, matrizSinFondo } = useMemo(() => {
    let h = color.replace('#', '')
    if (h.length === 3) h = h.split('').map((c) => c + c).join('')
    const n = parseInt(h, 16)
    const r = ((n >> 16) & 255) / 255
    const g = ((n >> 8) & 255) / 255
    const b = (n & 255) / 255
    // tiñe conservando el dibujo (luminancia -> color)
    const tinte = [
      0.2126 * r, 0.7152 * r, 0.0722 * r, 0, 0,
      0.2126 * g, 0.7152 * g, 0.0722 * g, 0, 0,
      0.2126 * b, 0.7152 * b, 0.0722 * b, 0, 0,
      0, 0, 0, 1, 0,
    ].join(' ')
    // además elimina el fondo: color fijo (tinta) y alfa = 1 - luminancia
    // (blanco → transparente, negro → tinta)
    const sinFondo = [
      0, 0, 0, 0, r,
      0, 0, 0, 0, g,
      0, 0, 0, 0, b,
      -0.2126, -0.7152, -0.0722, 0, 1,
    ].join(' ')
    return { matrizTinte: tinte, matrizSinFondo: sinFondo }
  }, [color])

  const vars = {
    '--sello-size': `${tamano}px`,
    '--sello-color': color,
    '--sello-color-texto': color,
    '--sello-inclinacion': `${inclinacion}deg`,
  }

  return (
    <div
      className={`sello${estampando ? ' sello--estampando' : ''}`}
      style={vars}
      role="img"
      aria-label="Sello de imagen"
      onClick={sellar}
    >
      {SALPICADURAS.map((p, i) => (
        <span
          key={i}
          className="sello__salpicadura"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s * tamano}px`,
            height: `${p.s * tamano}px`,
            animationDelay: `${p.d}s`,
          }}
        />
      ))}

      <div className="sello__papel">
        <svg className="sello__circulo" viewBox="0 0 100 100">
          <defs>
            <filter id={`${uid}-tinte`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values={quitarFondo ? matrizSinFondo : matrizTinte} result="tinte" />
              <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="ruido" />
              <feDisplacementMap in="tinte" in2="ruido" scale="2" />
            </filter>
            <clipPath id={`${uid}-clip`}>
              {forma === 'circular' ? (
                <circle cx="50" cy="50" r="47" />
              ) : (
                <rect x="4" y="4" width="92" height="92" rx="8" />
              )}
            </clipPath>
          </defs>

          {forma === 'circular' ? (
            <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth="3" />
          ) : (
            <rect x="4" y="4" width="92" height="92" rx="8" fill="none" stroke={color} strokeWidth="3" />
          )}

          <g clipPath={`url(#${uid}-clip)`}>
            <image
              href={imagen}
              x={50 - escala * 50}
              y={50 - escala * 50}
              width={escala * 100}
              height={escala * 100}
              filter={`url(#${uid}-tinte)`}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
