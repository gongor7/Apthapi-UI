'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './tramites.css'

/**
 * Sello de folio: numera cada página de un documento ("Pág. X de Y").
 *
 * @param {object} props
 * @param {string} [props.documento]   Título o código del documento
 * @param {number} [props.pagina=1]    Página actual
 * @param {number} [props.total=10]    Total de páginas
 * @param {string} [props.color]       Color de tinta
 * @param {number} [props.tamano]      Ancho en píxeles
 * @param {number} [props.estampar]    Cambia su valor para disparar un sellado
 * @param {() => void} [props.onSellado]
 */
export default function Foliador({
  documento = 'EXPEDIENTE Nº 042',
  pagina = 1,
  total = 10,
  color = '#0f172a',
  tamano = 200,
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
      timer.current = setTimeout(() => setEstampando(false), 700)
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

  // re-sella al cambiar de página
  useEffect(() => {
    sellar()
  }, [pagina, sellar])

  return (
    <div
      className={`folio${estampando ? ' folio--estampando' : ''}`}
      style={{ '--folio-color': color, '--folio-size': `${tamano}px` }}
      role="img"
      aria-label={`Página ${pagina} de ${total}`}
      onClick={sellar}
    >
      <div className="folio__documento">{documento}</div>
      <div className="folio__numeracion">
        <span className="folio__pagina">
          Pág. {pagina || 1} de {total}
        </span>
        <span>Folio legalizado</span>
      </div>
    </div>
  )
}
