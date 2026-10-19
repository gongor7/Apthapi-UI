'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './chuspita.css'

const ICONOS = { info: 'i', exito: '✓', alerta: '!', error: '✕' }

/**
 * Notificación institucional con cinta tejida lateral.
 *
 * @param {object} props
 * @param {string}  [props.titulo]           Título corto
 * @param {string}  [props.mensaje]           Mensaje
 * @param {'info'|'exito'|'alerta'|'error'} [props.tipo='info']
 * @param {boolean} [props.cerrable=true]     Muestra botón de cerrar
 * @param {number}  [props.duracion=0]        ms para auto-cerrar (0 = nunca)
 * @param {boolean} [props.visible=true]      Controla la visibilidad desde fuera
 * @param {() => void} [props.onCerrada]      Callback al cerrarse
 */
export default function ChuspitaAlert({
  titulo = 'Información',
  mensaje = '',
  tipo = 'info',
  cerrable = true,
  duracion = 0,
  visible = true,
  onCerrada,
}) {
  const [saliendo, setSaliendo] = useState(false)
  const timer = useRef(null)
  const refOnCerrada = useRef(onCerrada)

  useEffect(() => {
    refOnCerrada.current = onCerrada
  }, [onCerrada])

  const cerrar = useCallback(() => {
    setSaliendo((s) => {
      if (s) return s
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        refOnCerrada.current?.()
        setSaliendo(false)
      }, 250)
      return true
    })
  }, [])

  useEffect(() => {
    if (visible && duracion > 0) {
      timer.current = setTimeout(cerrar, duracion)
    }
    return () => clearTimeout(timer.current)
  }, [visible, duracion, cerrar])

  if (!visible) return null

  return (
    <div className={`chuspita chuspita--${tipo}${saliendo ? ' chuspita--saliendo' : ''}`} role="alert">
      <span className="chuspita__icono" aria-hidden="true">
        {ICONOS[tipo] || 'i'}
      </span>
      <div className="chuspita__cuerpo">
        <p className="chuspita__titulo">{titulo}</p>
        {mensaje && <p className="chuspita__mensaje">{mensaje}</p>}
      </div>
      {cerrable && (
        <button className="chuspita__cerrar" aria-label="Cerrar" onClick={cerrar}>
          ✕
        </button>
      )}
    </div>
  )
}
