'use client'

import { useState } from 'react'
import Sello from '../lib/Sello'
import ChuspitaAlert from '../lib/ChuspitaAlert'

const COMPONENTES = [
  {
    nombre: 'Sello',
    desc: 'El sello de goma institucional: circular o rectangular, con texto en arco y animación de sellado con tinta y salpicaduras.',
    props: 'texto · tamano · color · forma · inclinacion',
  },
  {
    nombre: 'SelloImagen',
    desc: 'Recibe cualquier imagen (o arrástrala al playground), elimina el fondo blanco y la convierte en tinta del color que elijas.',
    props: 'imagen · color · quitarFondo · escala · forma',
  },
  {
    nombre: 'CargoRecepcion',
    desc: 'El "RECIBIDO CON CARGO" de ventanilla: fecha y hora automáticas, número de trámite, receptor e institución.',
    props: 'numeroTramite · receptor · institucion · fecha · hora',
  },
  {
    nombre: 'Foliador',
    desc: 'El foliado legal de expedientes: "Pág. X de Y" con el título del documento, re-sellado en cada página.',
    props: 'documento · pagina · total · color',
  },
  {
    nombre: 'ChuspitaAlert',
    desc: 'Notificaciones con banda tejida andina, barra de progreso, botón de acción y pausa del auto-cierre al pasar el mouse.',
    props: 'titulo · mensaje · tipo · accion · duracion',
  },
]

export default function Home() {
  const [estampar, setEstampar] = useState(0)
  const [toast, setToast] = useState(false)

  return (
    <div className="landing">
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero__texto">
          <span className="hero__badge">🇧🇴 Hecho en Bolivia · Vue 3 y React</span>
          <h1 className="hero__titulo">
            Apthapi <span className="hero__degradado">UI</span>
          </h1>
          <p className="hero__idea">
            <em>Apthapi</em> es la reunión andina donde cada quien aporta algo. Esta librería es
            exactamente eso: <strong>componentes que digitalizan las acciones de los trámites
            institucionales</strong> — sellar, dar cargo, foliar, notificar — esas acciones que
            siempre se hicieron en papel y que ninguna librería de componentes tenía.
          </p>
          <div className="hero__acciones">
            <a className="boton boton--principal" href="/docs">
              Ver documentación
            </a>
            <button className="boton boton--secundario" onClick={() => setEstampar((e) => e + 1)}>
              🔖 ¡Sellar!
            </button>
            <a
              className="boton boton--fantasma"
              href="https://github.com/gongor7/Apthapi-UI"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="hero__demo">
          <div className="hero__papel">
            <Sello
              texto="APTHAPI"
              textoArriba="TRÁMITES DIGITALES"
              textoAbajo="DE BOLIVIA PARA EL MUNDO"
              tamano={230}
              color="#dc2626"
              inclinacion={-10}
              estampar={estampar}
            />
            {toast && (
              <ChuspitaAlert
                titulo="¡Sello aplicado!"
                mensaje="Así se sella digitalmente con Apthapi UI."
                tipo="exito"
                accion="Ver documentación"
                duracion={5000}
                onAccion={() => (window.location.href = '/docs')}
                onCerrada={() => setToast(false)}
              />
            )}
          </div>
          <button
            className="hero__toast-btn"
            onClick={() => {
              setEstampar((e) => e + 1)
              setToast(true)
            }}
          >
            Probar una notificación
          </button>
        </div>
      </section>

      {/* ===== Componentes ===== */}
      <section className="componentes">
        <h2 className="seccion__titulo">Los aportes</h2>
        <p className="seccion__sub">Cinco componentes, la misma API en Vue 3 y React.</p>
        <div className="componentes__grilla">
          {COMPONENTES.map((c) => (
            <a key={c.nombre} className="tarjeta" href="/docs">
              <h3>{c.nombre}</h3>
              <p>{c.desc}</p>
              <code>{c.props}</code>
            </a>
          ))}
        </div>
      </section>

      {/* ===== Instalación ===== */}
      <section className="instalacion">
        <h2 className="seccion__titulo">Empieza hoy</h2>
        <div className="instalacion__bloques">
          <div className="instalacion__bloque">
            <span>npm</span>
            <pre>npm install apthapi-ui</pre>
          </div>
          <div className="instalacion__bloque">
            <span>Vue</span>
            <pre>{`import { Sello, ChuspitaAlert } from 'apthapi-ui-vue'`}</pre>
          </div>
          <div className="instalacion__bloque">
            <span>React / Next.js</span>
            <pre>{`import { Sello, ChuspitaAlert } from 'apthapi-ui'`}</pre>
          </div>
        </div>
      </section>

      <footer className="pie">
        <div className="pie__cuerpo">
          <div className="pie__autor">
            <span className="pie__avatar">CG</span>
            <div>
              <strong>Cristhian Leandro Góngora Torrez</strong>
              <p className="pie__rol">Creador de Apthapi UI · Desarrollador Full Stack · Bolivia 🇧🇴</p>
            </div>
          </div>
          <div className="pie__redes">
            <a href="https://www.linkedin.com/in/cristhian-leandro-g%C3%B3ngora-torrez-537496215/" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/gongor7" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.38.82 1.11.82 2.24v3.32c0 .32.21.7.82.58A12 12 0 0 0 12 .3z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
        <div className="pie__legal">
          <span className="pie__marca">🔖 Apthapi UI</span>
          <span>La reunión andina de componentes · Hecho con 🇧🇴 en Bolivia</span>
          <a href="https://github.com/gongor7/Apthapi-UI" target="_blank" rel="noreferrer">
            github.com/gongor7/Apthapi-UI
          </a>
        </div>
      </footer>
    </div>
  )
}
