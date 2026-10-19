'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './tramites.css'

/**
 * Sello de ventanilla "RECIBIDO CON CARGO" con fecha, hora y número de trámite.
 *
 * @param {object} props
 * @param {string} [props.institucion]   Entidad que recibe
 * @param {string} [props.receptor]      Funcionario receptor
 * @param {string} [props.numeroTramite] Número de trámite/ruta
 * @param {string} [props.fecha]         Fecha (por defecto la actual)
 * @param {string} [props.hora]          Hora (por defecto la actual)
 * @param {string} [props.color]         Color de tinta
 * @param {number} [props.tamano]        Ancho en píxeles
 * @param {number} [props.estampar]      Cambia su valor para disparar un sellado
 * @param {() => void} [props.onSellado]
 */
export default function CargoRecepcion({
  institucion = 'MINISTERIO DE EJEMPLO',
  receptor = 'Ing. J. Quispe',
  numeroTramite = '000123/2026',
  fecha,
  hora,
  color = '#1d4ed8',
  tamano = 220,
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

  const ahora = new Date()
  const p2 = (n) => String(n).padStart(2, '0')
  const fechaFinal = fecha ?? `${p2(ahora.getDate())}/${p2(ahora.getMonth() + 1)}/${ahora.getFullYear()}`
  const horaFinal = hora ?? `${p2(ahora.getHours())}:${p2(ahora.getMinutes())}`

  return (
    <div
      className={`cargo${estampando ? ' cargo--estampando' : ''}`}
      style={{ '--cargo-color': color, '--cargo-size': `${tamano}px` }}
      role="img"
      aria-label={`Recibido con cargo: trámite ${numeroTramite}`}
      onClick={sellar}
    >
      <div className="cargo__caja">
        <div className="cargo__titulo">Recibido con cargo</div>
        <div className="cargo__fila"><span className="cargo__etiqueta">Trámite</span><span className="cargo__valor">{numeroTramite}</span></div>
        <div className="cargo__fila"><span className="cargo__etiqueta">Fecha</span><span className="cargo__valor">{fechaFinal}</span></div>
        <div className="cargo__fila"><span className="cargo__etiqueta">Hora</span><span className="cargo__valor">{horaFinal}</span></div>
        <div className="cargo__fila"><span className="cargo__etiqueta">Recibió</span><span className="cargo__valor">{receptor}</span></div>
        <div className="cargo__fila"><span className="cargo__etiqueta">Entidad</span><span className="cargo__valor">{institucion}</span></div>
      </div>
    </div>
  )
}
