'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './sello.css'

const SALPICADURAS = [
  { x: -6, y: 8, s: 0.1, d: 0.3 },
  { x: 102, y: 12, s: 0.07, d: 0.36 },
  { x: -10, y: 88, s: 0.08, d: 0.42 },
  { x: 98, y: 92, s: 0.12, d: 0.26 },
  { x: 46, y: -8, s: 0.06, d: 0.48 },
  { x: 52, y: 104, s: 0.09, d: 0.32 },
]

/**
 * Sello con animación de sellado.
 *
 * @param {object} props
 * @param {string}  [props.texto='APROBADO']      Texto principal
 * @param {string}  [props.textoArriba]           Texto curvo superior (forma circular)
 * @param {string}  [props.textoAbajo]            Texto curvo inferior (forma circular)
 * @param {number}  [props.tamano=180]            Tamaño en píxeles
 * @param {string}  [props.color='#dc2626']       Color del borde / tinta
 * @param {string}  [props.colorTexto]            Color del texto (por defecto igual a color)
 * @param {'circular'|'rectangular'} [props.forma='circular']
 * @param {number}  [props.inclinacion=-12]       Inclinación en grados
 * @param {number}  [props.estampar=0]            Cambia su valor para disparar un sellado
 * @param {() => void} [props.onSellado]          Callback al terminar de sellar
 */
export default function Sello({
  texto = 'APROBADO',
  textoArriba = 'REPÚBLICA DEL SELLO',
  textoAbajo = 'OFICINA CENTRAL',
  tamano = 180,
  color = '#dc2626',
  colorTexto,
  forma = 'circular',
  inclinacion = -12,
  estampar = 0,
  onSellado,
}) {
  const [estampando, setEstampando] = useState(false)
  const timer = useRef(null)
  const refEstampar = useRef(estampar)
  const refOnSellado = useRef(onSellado)

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

  // sellado inicial
  useEffect(() => {
    sellar()
    return () => clearTimeout(timer.current)
  }, [sellar])

  // sellado externo cuando cambia la prop `estampar`
  useEffect(() => {
    if (estampar !== refEstampar.current) {
      refEstampar.current = estampar
      sellar()
    }
  }, [estampar, sellar])

  const colorTextoFinal = colorTexto || color

  // parte el texto en líneas de máx. `max` caracteres para que no desborde
  const partirTexto = (t, max = 10) => {
    const palabras = String(t).trim().split(/\s+/)
    const lineas = []
    let actual = ''
    for (const p of palabras) {
      if (!actual) actual = p
      else if (actual.length + 1 + p.length <= max) actual += ' ' + p
      else {
        lineas.push(actual)
        actual = p
      }
    }
    if (actual) lineas.push(actual)
    return lineas
  }

  const lineas = useMemo(() => partirTexto(texto), [texto])

  // Fuente del texto central en unidades del viewBox (0-100). Se mide el
  // texto REAL renderizado y se encoge hasta caber en el círculo interior
  // (r=26): garantiza centrado y que nunca desborde.
  const FUENTE_BASE = 16
  const textoRef = useRef(null)
  const [fuenteUnidades, setFuenteUnidades] = useState(FUENTE_BASE)

  useEffect(() => {
    const medir = () => {
      const texto = textoRef.current
      if (!texto || !texto.children.length) {
        setFuenteUnidades(FUENTE_BASE)
        return
      }
      let factor = 1
      for (const t of texto.children) {
        const ancho = t.getComputedTextLength()
        if (!ancho) continue
        const dy = Math.abs(parseFloat(t.getAttribute('y')) - 50)
        // ancho máximo disponible a esa altura del círculo (cuerda)
        const maxAncho = 2 * Math.sqrt(Math.max(26 * 26 - dy * dy, 1))
        factor = Math.min(factor, maxAncho / ancho)
      }
      // también debe caber verticalmente
      let unidades = Math.min(FUENTE_BASE * factor, 50 / (lineas.length * 1.1))
      setFuenteUnidades(Math.max(unidades, 4))
    }
    // doble frame: asegura el texto renderizado antes de medir
    const r1 = requestAnimationFrame(() => medir())
    return () => cancelAnimationFrame(r1)
  }, [texto, tamano, forma, lineas])

  const fuenteCentral = fuenteUnidades
  const altoLinea = fuenteCentral * 1.1

  // fuente para la forma rectangular (por fórmula; el contenedor envuelve solo)
  const fuenteRectangular = useMemo(() => {
    const masLarga = Math.max(...lineas.map((l) => l.length), 1)
    const porAncho = 82 / (masLarga * 0.62)
    const porAlto = 88 / (lineas.length * 1.15)
    return Math.min(FUENTE_BASE, porAncho, porAlto)
  }, [lineas])

  // fuente del arco: se encoge si el texto no cabe en el semicírculo (~119 unidades)
  const fuenteArco = useMemo(() => {
    const maxLen = Math.max(textoArriba.length, textoAbajo.length, 1)
    const porAncho = 110 / (maxLen * 0.9)
    return Math.min(0.085, porAncho) * tamano
  }, [textoArriba, textoAbajo, tamano])
  const vars = {
    '--sello-size': `${tamano}px`,
    '--sello-color': color,
    '--sello-color-texto': colorTextoFinal,
    '--sello-inclinacion': `${inclinacion}deg`,
  }

  return (
    <div
      className={`sello${estampando ? ' sello--estampando' : ''}`}
      style={vars}
      role="img"
      aria-label={`Sello: ${texto}`}
      onClick={sellar}
    >
      <svg className="sello-defs" aria-hidden="true">
        <defs>
          <filter id="sello-textura">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="ruido" />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale="2.5" />
          </filter>
        </defs>
      </svg>

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
        {forma === 'circular' ? (
          <svg className="sello__circulo" viewBox="0 0 100 100">
            <defs>
              <path id="arco-superior" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0" fill="none" />
              <path id="arco-inferior" d="M 50,50 m -38,0 a 38,38 0 1,0 76,0" fill="none" />
            </defs>
            <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth="3" />
            <circle cx="50" cy="50" r="42.5" fill="none" stroke={color} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="1.5" />
            <text className="sello__arco-texto" fill={colorTextoFinal} fontSize={fuenteArco}>
              <textPath href="#arco-superior" startOffset="50%" textAnchor="middle">
                {textoArriba}
              </textPath>
            </text>
            <text className="sello__arco-texto" fill={colorTextoFinal} fontSize={fuenteArco}>
              <textPath href="#arco-inferior" startOffset="50%" textAnchor="middle">
                {textoAbajo}
              </textPath>
            </text>
            <text
              ref={textoRef}
              className="sello__texto-central"
              textAnchor="middle"
              dominantBaseline="central"
              fill={colorTextoFinal}
              fontSize={fuenteCentral}
            >
              {lineas.map((l, i) => (
                <tspan
                  key={i}
                  x="50"
                  y={50 - ((lineas.length - 1) * altoLinea) / 2 + i * altoLinea}
                >
                  {l}
                </tspan>
              ))}
            </text>
          </svg>
        ) : (
          <div className="sello__rectangulo" style={{ '--sello-fuente': `${(fuenteRectangular / 100) * tamano}px` }}>
            {lineas.map((l, i) => (
              <span key={i} className="sello__texto-central">
                {l}
              </span>
            ))}
            {textoAbajo && <span className="sello__sub">{textoAbajo}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
