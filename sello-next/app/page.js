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
        <div className="pie__autor">
          <span className="pie__avatar">CG</span>
          <div>
            <strong>Cristhian Leandro Góngora Torrez</strong>
            <p className="pie__rol">Creador de Apthapi UI · Desarrollador Full Stack · Bolivia 🇧🇴</p>
            <div className="pie__redes">
              <a href="https://www.linkedin.com/in/cristhian-leandro-g%C3%B3ngora-torrez-537496215/" target="_blank" rel="noreferrer">
                in · LinkedIn
              </a>
              <a href="https://github.com/gongor7" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
        <p className="pie__legal">
          🔖 <strong>Apthapi UI</strong> — la reunión andina de componentes. Hecho con 🇧🇴 ·{' '}
          <a href="https://github.com/gongor7/Apthapi-UI" target="_blank" rel="noreferrer">
            Repositorio
          </a>
        </p>
      </footer>
    </div>
  )
}
