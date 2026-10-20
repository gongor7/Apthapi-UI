'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './chuspita.css'

const ICONOS = {
  info: 'M12 8H12.01M11 12H12V16M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z',
  exito: 'M20 6L9 17L4 12',
  alerta: 'M12 9V13M12 17H12.01M10.3 3.9L1.8 18A2 2 0 0 0 3.5 21H20.5A2 2 0 0 0 22.2 18L13.7 3.9A2 2 0 0 0 10.3 3.9Z',
  error: 'M15 9L9 15M9 9L15 15M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z',
}

/**
 * Notificación institucional con banda tejida andina, barra de progreso,
 * botón de acción y pausa del auto-cierre al pasar el mouse.
 *
 * @param {object} props
 * @param {string}  [props.titulo]           Título corto
 * @param {string}  [props.mensaje]          Mensaje
 * @param {'info'|'exito'|'alerta'|'error'} [props.tipo='info']
 * @param {string}  [props.accion]           Texto de un botón de acción opcional
 * @param {boolean} [props.cerrable=true]    Muestra botón de cerrar
 * @param {number}  [props.duracion=0]       ms para auto-cerrar (0 = nunca)
 * @param {boolean} [props.visible=true]     Controla la visibilidad desde fuera
 * @param {() => void} [props.onCerrada]     Callback al cerrarse
 * @param {() => void} [props.onAccion]      Callback del botón de acción
 */
export default function ChuspitaAlert({
  titulo = 'Información',
  mensaje = '',
  tipo = 'info',
  accion,
  cerrable = true,
  duracion = 0,
  visible = true,
  onCerrada,
  onAccion,
}) {
  const [saliendo, setSaliendo] = useState(false)
  const timer = useRef(null)
  const restante = useRef(0)
  const iniciadoEn = useRef(0)
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
      }, 300)
      return true
    })
  }, [])

  const programarCierre = useCallback(
    (ms) => {
      clearTimeout(timer.current)
      if (ms <= 0) return
      restante.current = ms
      iniciadoEn.current = Date.now()
      timer.current = setTimeout(cerrar, ms + 300)
    },
    [cerrar]
  )

  useEffect(() => {
    if (visible) programarCierre(duracion)
    return () => clearTimeout(timer.current)
  }, [visible, duracion, programarCierre])

  // pausa real del auto-cierre mientras el usuario lee
  const alEntrar = () => {
    if (restante.current <= 0) return
    clearTimeout(timer.current)
    restante.current = Math.max(restante.current - (Date.now() - iniciadoEn.current), 0)
  }
  const alSalir = () => {
    if (restante.current > 0 && visible && !saliendo) programarCierre(restante.current)
  }

  if (!visible) return null

  return (
    <div
      className={`chuspita chuspita--${tipo}${saliendo ? ' chuspita--saliendo' : ''}`}
      style={duracion > 0 ? { '--chuspita-duracion': `${duracion}ms` } : undefined}
      role="alert"
      onMouseEnter={alEntrar}
      onMouseLeave={alSalir}
    >
      <span className="chuspita__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONOS[tipo] || ICONOS.info} />
        </svg>
      </span>
      <div className="chuspita__cuerpo">
        <p className="chuspita__titulo">{titulo}</p>
        {mensaje && <p className="chuspita__mensaje">{mensaje}</p>}
        {accion && (
          <button className="chuspita__accion" onClick={onAccion}>
            {accion}
          </button>
        )}
      </div>
      {cerrable && (
        <button className="chuspita__cerrar" aria-label="Cerrar" onClick={cerrar}>
          ✕
        </button>
      )}
      <span className="chuspita__pompon chuspita__pompon--sup" aria-hidden="true" />
      <span className="chuspita__pompon chuspita__pompon--inf" aria-hidden="true" />
      <span className="chuspita__pompon chuspita__pompon--der" aria-hidden="true" />
      {duracion > 0 && <span className="chuspita__progreso" aria-hidden="true" />}
    </div>
  )
}
