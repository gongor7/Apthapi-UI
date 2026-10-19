'use client'

import { useMemo, useState } from 'react'
import Sello from '../lib/Sello'
import SelloImagen from '../lib/SelloImagen'
import ChuspitaAlert from '../lib/ChuspitaAlert'
import CargoRecepcion from '../lib/CargoRecepcion'
import Foliador from '../lib/Foliador'
import { PRESETS } from '../lib/presets'

const TABS = [
  { id: 'texto', nombre: 'Sello de texto' },
  { id: 'imagen', nombre: 'Sello de imagen' },
  { id: 'alertas', nombre: 'ChuspitaAlert' },
  { id: 'tramites', nombre: 'Trámites' },
]

export default function Home() {
  const [pestana, setPestana] = useState('texto')

  // ---- sello de texto ----
  const [texto, setTexto] = useState('APROBADO')
  const [textoArriba, setTextoArriba] = useState('REPÚBLICA DEL SELLO')
  const [textoAbajo, setTextoAbajo] = useState('OFICINA CENTRAL')
  const [tamano, setTamano] = useState(180)
  const [color, setColor] = useState('#dc2626')
  const [colorTexto, setColorTexto] = useState('#dc2626')
  const [forma, setForma] = useState('circular')
  const [inclinacion, setInclinacion] = useState(-12)
  const [estampar, setEstampar] = useState(0)

  const usarColorTexto = colorTexto !== color

  const codigo = useMemo(() => {
    const l = [`texto="${texto}"`]
    if (forma === 'circular') {
      l.push(`textoArriba="${textoArriba}"`, `textoAbajo="${textoAbajo}"`)
    }
    l.push(`tamano={${tamano}}`, `color="${color}"`)
    if (usarColorTexto) l.push(`colorTexto="${colorTexto}"`)
    l.push(`forma="${forma}"`, `inclinacion={${inclinacion}}`)
    return `<Sello\n  ${l.join('\n  ')}\n/>`
  }, [texto, textoArriba, textoAbajo, tamano, color, colorTexto, forma, inclinacion, usarColorTexto])

  // ---- sello de imagen ----
  const [imagen, setImagen] = useState(PRESETS[0].imagen)
  const [tamanoImg, setTamanoImg] = useState(180)
  const [colorImg, setColorImg] = useState('#1d4ed8')
  const [formaImg, setFormaImg] = useState('circular')
  const [escalaImg, setEscalaImg] = useState(0.6)
  const [estamparImg, setEstamparImg] = useState(0)

  // ---- drag & drop de imagen ----
  const [arrastrando, setArrastrando] = useState(false)
  const [errorImagen, setErrorImagen] = useState('')

  const cargarArchivo = (file) => {
    setErrorImagen('')
    if (!file || !file.type.startsWith('image/')) {
      setErrorImagen('Ese archivo no es una imagen (jpg, png, svg, webp…).')
      return
    }
    const lector = new FileReader()
    lector.onload = () => setImagen(lector.result)
    lector.readAsDataURL(file)
  }

  const alSoltar = (e) => {
    e.preventDefault()
    setArrastrando(false)
    cargarArchivo(e.dataTransfer?.files?.[0])
  }

  const codigoImagen = useMemo(
    () => `<SelloImagen\n  imagen="…"\n  tamano={${tamanoImg}}\n  color="${colorImg}"\n  forma="${formaImg}"\n  escala={${escalaImg}}\n  inclinacion={${inclinacion}}\n/>`,
    [tamanoImg, colorImg, formaImg, escalaImg, inclinacion]
  )

  // ---- alertas ----
  const [alertas, setAlertas] = useState([])
  const lanzarAlerta = (tipo, titulo, mensaje) => {
    const id = Date.now() + Math.random()
    setAlertas((a) => [...a, { id, tipo, titulo, mensaje }])
  }

  // ---- trámites ----
  const [numTramite, setNumTramite] = useState('000123/2026')
  const [receptor, setReceptor] = useState('Ing. J. Quispe')
  const [colorCargo, setColorCargo] = useState('#1d4ed8')
  const [estamparCargo, setEstamparCargo] = useState(0)
  const [documentoFolio, setDocumentoFolio] = useState('EXPEDIENTE Nº 042')
  const [paginaFolio, setPaginaFolio] = useState(1)
  const [totalFolio, setTotalFolio] = useState(5)
  const [colorFolio, setColorFolio] = useState('#0f172a')
  const [estamparFolio, setEstamparFolio] = useState(0)

  const codigoTramites = useMemo(
    () => `<CargoRecepcion\n  numeroTramite="${numTramite}"\n  receptor="${receptor}"\n  color="${colorCargo}"\n/>\n\n<Foliador\n  documento="${documentoFolio}"\n  pagina={${paginaFolio}}\n  total={${totalFolio}}\n  color="${colorFolio}"\n/>`,
    [numTramite, receptor, colorCargo, documentoFolio, paginaFolio, totalFolio, colorFolio]
  )

  return (
    <div className="pg">
      <header className="pg__header">
        <h1>
          🔖 Apthapi UI <small>Next.js</small>
        </h1>
        <p>Colección boliviana de componentes para digitalizar trámites: sellos, cargos, folios y notificaciones.</p>
      </header>

      <nav className="pg__tabs">
        {TABS.map((t) => (
          <button key={t.id} className={pestana === t.id ? 'activa' : ''} onClick={() => setPestana(t.id)}>
            {t.nombre}
          </button>
        ))}
      </nav>

      {pestana === 'texto' && (
        <main className="pg__main">
          <section className="pg__preview">
            <div className="pg__papel">
              <Sello
                texto={texto}
                textoArriba={textoArriba}
                textoAbajo={textoAbajo}
                tamano={tamano}
                color={color}
                colorTexto={usarColorTexto ? colorTexto : undefined}
                forma={forma}
                inclinacion={inclinacion}
                estampar={estampar}
              />
            </div>
            <button className="pg__btn" onClick={() => setEstampar((e) => e + 1)}>
              Sellar
            </button>
          </section>
          <aside className="pg__panel">
            <h2>Props</h2>
            <label className="pg__campo">
              <span>texto</span>
              <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </label>
            {forma === 'circular' && (
              <>
                <label className="pg__campo">
                  <span>textoArriba</span>
                  <input type="text" value={textoArriba} onChange={(e) => setTextoArriba(e.target.value)} />
                </label>
                <label className="pg__campo">
                  <span>textoAbajo</span>
                  <input type="text" value={textoAbajo} onChange={(e) => setTextoAbajo(e.target.value)} />
                </label>
              </>
            )}
            <label className="pg__campo">
              <span>tamano ({tamano}px)</span>
              <input type="range" min="100" max="320" step="10" value={tamano} onChange={(e) => setTamano(+e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>color</span>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>colorTexto</span>
              <input type="color" value={colorTexto} onChange={(e) => setColorTexto(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>forma</span>
              <select value={forma} onChange={(e) => setForma(e.target.value)}>
                <option value="circular">circular</option>
                <option value="rectangular">rectangular</option>
              </select>
            </label>
            <label className="pg__campo">
              <span>inclinacion ({inclinacion}°)</span>
              <input type="range" min="-45" max="45" step="1" value={inclinacion} onChange={(e) => setInclinacion(+e.target.value)} />
            </label>
            <h2>Código</h2>
            <pre className="pg__codigo">{codigo}</pre>
          </aside>
        </main>
      )}

      {pestana === 'imagen' && (
        <main className="pg__main">
          <section className="pg__preview">
            <div className="pg__papel">
              <SelloImagen
                imagen={imagen}
                tamano={tamanoImg}
                color={colorImg}
                forma={formaImg}
                escala={escalaImg}
                inclinacion={inclinacion}
                estampar={estamparImg}
              />
            </div>
            <div
              className={`pg__drop${arrastrando ? ' pg__drop--activa' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setArrastrando(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setArrastrando(false)
              }}
              onDrop={alSoltar}
            >
              {arrastrando ? (
                <p className="pg__drop__texto">¡Suelta la imagen aquí! 📥</p>
              ) : (
                <>
                  <p className="pg__drop__texto">🩼 Arrastra cualquier imagen aquí (jpg, png, svg, webp)</p>
                  <label className="pg__drop__btn">
                    o haz clic para elegir un archivo
                    <input type="file" accept="image/*" hidden onChange={(e) => cargarArchivo(e.target.files?.[0])} />
                  </label>
                </>
              )}
            </div>
            {errorImagen && <p className="pg__error">{errorImagen}</p>}
            <button className="pg__btn" onClick={() => setEstamparImg((e) => e + 1)}>
              Sellar
            </button>
          </section>
          <aside className="pg__panel">
            <h2>Props</h2>
            <div className="pg__campo">
              <span>imagen (presets)</span>
              <div className="pg__presets">
                {PRESETS.map((p) => (
                  <button key={p.nombre} className={imagen === p.imagen ? 'activa' : ''} onClick={() => setImagen(p.imagen)}>
                    <img src={p.imagen} alt={p.nombre} width={22} height={22} />
                    {p.nombre}
                  </button>
                ))}
              </div>
            </div>
            <label className="pg__campo">
              <span>imagen (URL)</span>
              <input type="text" value={imagen} placeholder="https://… o data:…" onChange={(e) => setImagen(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>tamano ({tamanoImg}px)</span>
              <input type="range" min="100" max="320" step="10" value={tamanoImg} onChange={(e) => setTamanoImg(+e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>color de tinta</span>
              <input type="color" value={colorImg} onChange={(e) => setColorImg(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>forma</span>
              <select value={formaImg} onChange={(e) => setFormaImg(e.target.value)}>
                <option value="circular">circular</option>
                <option value="rectangular">rectangular</option>
              </select>
            </label>
            <label className="pg__campo">
              <span>escala imagen ({escalaImg})</span>
              <input type="range" min="0.2" max="1" step="0.05" value={escalaImg} onChange={(e) => setEscalaImg(+e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>inclinacion ({inclinacion}°)</span>
              <input type="range" min="-45" max="45" step="1" value={inclinacion} onChange={(e) => setInclinacion(+e.target.value)} />
            </label>
            <h2>Código</h2>
            <pre className="pg__codigo">{codigoImagen}</pre>
          </aside>
        </main>
      )}

      {pestana === 'alertas' && (
        <main className="pg__main">
          <section className="pg__preview">
            <div className="pg__columna">
              {alertas.map((a) => (
                <ChuspitaAlert
                  key={a.id}
                  titulo={a.titulo}
                  mensaje={a.mensaje}
                  tipo={a.tipo}
                  duracion={5000}
                  onCerrada={() => setAlertas((list) => list.filter((x) => x.id !== a.id))}
                />
              ))}
            </div>
          </section>
          <aside className="pg__panel">
            <h2>Disparar notificaciones</h2>
            <div className="pg__disparos">
              <button className="pg__disparo pg__disparo--info" onClick={() => lanzarAlerta('info', 'Trámite recibido', 'Su documento fue registrado en ventanilla única.')}>
                Info
              </button>
              <button className="pg__disparo pg__disparo--exito" onClick={() => lanzarAlerta('exito', 'Sello aplicado', 'El documento fue sellado exitosamente.')}>
                Éxito
              </button>
              <button className="pg__disparo pg__disparo--alerta" onClick={() => lanzarAlerta('alerta', 'Folio incompleto', 'Faltan 2 páginas por legalizar en el expediente.')}>
                Alerta
              </button>
              <button className="pg__disparo pg__disparo--error" onClick={() => lanzarAlerta('error', 'Trámite rechazado', 'El documento no cumple los requisitos de la entidad.')}>
                Error
              </button>
            </div>
            <h2>Código</h2>
            <pre className="pg__codigo">{`<ChuspitaAlert
  titulo="Trámite recibido"
  mensaje="Su documento fue registrado."
  tipo="exito"
  duracion={5000}
/>`}</pre>
          </aside>
        </main>
      )}

      {pestana === 'tramites' && (
        <main className="pg__main">
          <section className="pg__preview">
            <div className="pg__papel pg__papel--tramites">
              <CargoRecepcion numeroTramite={numTramite} receptor={receptor} color={colorCargo} estampar={estamparCargo} />
              <Foliador documento={documentoFolio} pagina={paginaFolio} total={totalFolio} color={colorFolio} estampar={estamparFolio} />
            </div>
            <div className="pg__acciones">
              <button className="pg__btn" onClick={() => setEstamparCargo((e) => e + 1)}>
                Sellar cargo
              </button>
              <button
                className="pg__btn"
                onClick={() => {
                  setPaginaFolio((p) => (p % totalFolio) + 1)
                  setEstamparFolio((e) => e + 1)
                }}
              >
                Pasar página
              </button>
            </div>
          </section>
          <aside className="pg__panel">
            <h2>CargoRecepcion</h2>
            <label className="pg__campo">
              <span>numeroTramite</span>
              <input type="text" value={numTramite} onChange={(e) => setNumTramite(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>receptor</span>
              <input type="text" value={receptor} onChange={(e) => setReceptor(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>color</span>
              <input type="color" value={colorCargo} onChange={(e) => setColorCargo(e.target.value)} />
            </label>
            <h2>Foliador</h2>
            <label className="pg__campo">
              <span>documento</span>
              <input type="text" value={documentoFolio} onChange={(e) => setDocumentoFolio(e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>pagina ({paginaFolio})</span>
              <input type="range" min="1" max={totalFolio} step="1" value={paginaFolio} onChange={(e) => setPaginaFolio(+e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>total ({totalFolio})</span>
              <input type="range" min="1" max="20" step="1" value={totalFolio} onChange={(e) => setTotalFolio(+e.target.value)} />
            </label>
            <label className="pg__campo">
              <span>color</span>
              <input type="color" value={colorFolio} onChange={(e) => setColorFolio(e.target.value)} />
            </label>
            <h2>Código</h2>
            <pre className="pg__codigo">{codigoTramites}</pre>
          </aside>
        </main>
      )}
    </div>
  )
}
