<script setup>
import { computed, ref } from 'vue'
import { Sello, SelloImagen, ChuspitaAlert, PRESETS } from '../lib'

const pestana = ref('texto')

// ---- pestaña alertas ----
const alertas = ref([])
let alertaId = 0

// ---- pestaña trámites ----
const numTramite = ref('000123/2026')
const receptor = ref('Ing. J. Quispe')
const colorCargo = ref('#1d4ed8')
const estamparCargo = ref(0)
const documentoFolio = ref('EXPEDIENTE Nº 042')
const paginaFolio = ref(1)
const totalFolio = ref(5)
const colorFolio = ref('#0f172a')
const estamparFolio = ref(0)

const codigoTramites = computed(() => `<CargoRecepcion
  numero-tramite="${numTramite.value}"
  receptor="${receptor.value}"
  color="${colorCargo.value}"
/>

<Foliador
  documento="${documentoFolio.value}"
  :pagina="${paginaFolio.value}"
  :total="${totalFolio.value}"
  color="${colorFolio.value}"
/>`)

function lanzarAlerta(tipo, titulo, mensaje) {
  const id = ++alertaId
  alertas.value.push({ id, tipo, titulo, mensaje })
  setTimeout(() => {
    alertas.value = alertas.value.filter((a) => a.id !== id)
  }, 6000)
}


const texto = ref('APROBADO')
const textoArriba = ref('REPÚBLICA DEL SELLO')
const textoAbajo = ref('OFICINA CENTRAL')
const tamano = ref(180)
const color = ref('#dc2626')
const colorTexto = ref('#dc2626')
const forma = ref('circular')
const inclinacion = ref(-12)
const estampar = ref(0)

// ---- pestaña imagen ----
const imagen = ref(PRESETS[0].imagen)
const tamanoImg = ref(180)
const colorImg = ref('#1d4ed8')
const formaImg = ref('circular')
const escalaImg = ref(0.6)
const estamparImg = ref(0)

const codigoImagen = computed(() => `<SelloImagen
  imagen="${imagen.value.slice(0, 60)}${imagen.value.length > 60 ? '…' : ''}"
  :tamano="${tamanoImg.value}"
  color="${colorImg.value}"
  forma="${formaImg.value}"
  :escala="${escalaImg.value}"
  :inclinacion="${inclinacion.value}"
/>`)

const usarColorTexto = computed(() => colorTexto.value !== color.value)

const codigo = computed(() => {
  const l = []
  l.push(`texto="${texto.value}"`)
  if (forma.value === 'circular') {
    l.push(`texto-arriba="${textoArriba.value}"`)
    l.push(`texto-abajo="${textoAbajo.value}"`)
  }
  l.push(`:tamano="${tamano.value}"`)
  l.push(`color="${color.value}"`)
  if (usarColorTexto.value) l.push(`color-texto="${colorTexto.value}"`)
  l.push(`forma="${forma.value}"`)
  l.push(`:inclinacion="${inclinacion.value}"`)
  return `<Sello\n  ${l.join('\n  ')}\n/>`
})

function sellar() {
  estampar.value++
}
</script>

<template>
  <div class="pg">
    <header class="pg__header">
      <h1>🔖 Apthapi UI <small>Vue</small></h1>
      <p>Colección boliviana de componentes para digitalizar trámites: sellos, cargos, folios y notificaciones.</p>
    </header>

    <nav class="pg__tabs">
      <button :class="{ activa: pestana === 'texto' }" @click="pestana = 'texto'">Sello de texto</button>
      <button :class="{ activa: pestana === 'imagen' }" @click="pestana = 'imagen'">Sello de imagen</button>
      <button :class="{ activa: pestana === 'alertas' }" @click="pestana = 'alertas'">ChuspitaAlert</button>
    </nav>

    <main v-if="pestana === 'texto'" class="pg__main">
      <section class="pg__preview">
        <div class="pg__papel">
          <Sello
            :estampar="estampar"
            :texto="texto"
            :texto-arriba="textoArriba"
            :texto-abajo="textoAbajo"
            :tamano="tamano"
            :color="color"
            :color-texto="usarColorTexto ? colorTexto : null"
            :forma="forma"
            :inclinacion="inclinacion"
          />
        </div>
        <button class="pg__btn" @click="sellar">Sellar</button>
      </section>

      <aside class="pg__panel">
        <h2>Props</h2>

        <label class="pg__campo">
          <span>texto</span>
          <input v-model="texto" type="text" />
        </label>

        <template v-if="forma === 'circular'">
          <label class="pg__campo">
            <span>texto-arriba</span>
            <input v-model="textoArriba" type="text" />
          </label>
          <label class="pg__campo">
            <span>texto-abajo</span>
            <input v-model="textoAbajo" type="text" />
          </label>
        </template>

        <label class="pg__campo">
          <span>tamano ({{ tamano }}px)</span>
          <input v-model.number="tamano" type="range" min="100" max="320" step="10" />
        </label>

        <label class="pg__campo">
          <span>color</span>
          <input v-model="color" type="color" />
        </label>

        <label class="pg__campo">
          <span>color-texto</span>
          <input v-model="colorTexto" type="color" />
        </label>

        <label class="pg__campo">
          <span>forma</span>
          <select v-model="forma">
            <option value="circular">circular</option>
            <option value="rectangular">rectangular</option>
          </select>
        </label>

        <label class="pg__campo">
          <span>inclinacion ({{ inclinacion }}°)</span>
          <input v-model.number="inclinacion" type="range" min="-45" max="45" step="1" />
        </label>

        <h2>Código</h2>
        <pre class="pg__codigo">{{ codigo }}</pre>
      </aside>
    </main>

    <main v-else-if="pestana === 'imagen'" class="pg__main">
      <section class="pg__preview">
        <div class="pg__papel">
          <SelloImagen
            :imagen="imagen"
            :tamano="tamanoImg"
            :color="colorImg"
            :forma="formaImg"
            :escala="escalaImg"
            :inclinacion="inclinacion"
            :estampar="estamparImg"
          />
        </div>
        <button class="pg__btn" @click="estamparImg++">Sellar</button>
      </section>

      <aside class="pg__panel">
        <h2>Props</h2>

        <div class="pg__campo">
          <span>imagen (presets)</span>
          <div class="pg__presets">
            <button
              v-for="p in PRESETS"
              :key="p.nombre"
              :class="{ activa: imagen === p.imagen }"
              @click="imagen = p.imagen"
            >
              <img :src="p.imagen" :alt="p.nombre" width="22" height="22" />
              {{ p.nombre }}
            </button>
          </div>
        </div>

        <label class="pg__campo">
          <span>imagen (URL)</span>
          <input v-model="imagen" type="text" placeholder="https://… o data:…" />
        </label>

        <label class="pg__campo">
          <span>tamano ({{ tamanoImg }}px)</span>
          <input v-model.number="tamanoImg" type="range" min="100" max="320" step="10" />
        </label>

        <label class="pg__campo">
          <span>color de tinta</span>
          <input v-model="colorImg" type="color" />
        </label>

        <label class="pg__campo">
          <span>forma</span>
          <select v-model="formaImg">
            <option value="circular">circular</option>
            <option value="rectangular">rectangular</option>
          </select>
        </label>

        <label class="pg__campo">
          <span>escala imagen ({{ escalaImg }})</span>
          <input v-model.number="escalaImg" type="range" min="0.2" max="1" step="0.05" />
        </label>

        <label class="pg__campo">
          <span>inclinacion ({{ inclinacion }}°)</span>
          <input v-model.number="inclinacion" type="range" min="-45" max="45" step="1" />
        </label>

        <h2>Código</h2>
        <pre class="pg__codigo">{{ codigoImagen }}</pre>
      </aside>
    </main>

    <main v-else-if="pestana === 'alertas'" class="pg__main">
      <section class="pg__preview">
        <div class="pg__columna">
          <ChuspitaAlert
            v-for="a in alertas"
            :key="a.id"
            :titulo="a.titulo"
            :mensaje="a.mensaje"
            :tipo="a.tipo"
            :duracion="5000"
          />
        </div>
      </section>

      <aside class="pg__panel">
        <h2>Disparar notificaciones</h2>
        <div class="pg__disparos">
          <button class="pg__disparo pg__disparo--info" @click="lanzarAlerta('info', 'Trámite recibido', 'Su documento fue registrado en ventanilla única.')">Info</button>
          <button class="pg__disparo pg__disparo--exito" @click="lanzarAlerta('exito', 'Sello aplicado', 'El documento fue sellado exitosamente.')">Éxito</button>
          <button class="pg__disparo pg__disparo--alerta" @click="lanzarAlerta('alerta', 'Folio incompleto', 'Faltan 2 páginas por legalizar en el expediente.')">Alerta</button>
          <button class="pg__disparo pg__disparo--error" @click="lanzarAlerta('error', 'Trámite rechazado', 'El documento no cumple los requisitos de la entidad.')">Error</button>
        </div>
        <h2>Código</h2>
        <pre class="pg__codigo">{{ `<ChuspitaAlert
  titulo="Trámite recibido"
  mensaje="Su documento fue registrado."
  tipo="exito"
  :duracion="5000"
/>` }}</pre>
      </aside>
    </main>

    <main v-else class="pg__main">
      <section class="pg__preview">
        <div class="pg__papel pg__papel--tramites">
          <CargoRecepcion
            :numero-tramite="numTramite"
            :receptor="receptor"
            :color="colorCargo"
            :estampar="estamparCargo"
          />
          <Foliador
            :documento="documentoFolio"
            :pagina="paginaFolio"
            :total="totalFolio"
            :color="colorFolio"
            :estampar="estamparFolio"
          />
        </div>
        <div class="pg__acciones">
          <button class="pg__btn" @click="estamparCargo++">Sellar cargo</button>
          <button class="pg__btn" @click="paginaFolio = (paginaFolio % totalFolio) + 1; estamparFolio++">Pasar página</button>
        </div>
      </section>

      <aside class="pg__panel">
        <h2>CargoRecepcion</h2>
        <label class="pg__campo">
          <span>numero-tramite</span>
          <input v-model="numTramite" type="text" />
        </label>
        <label class="pg__campo">
          <span>receptor</span>
          <input v-model="receptor" type="text" />
        </label>
        <label class="pg__campo">
          <span>color</span>
          <input v-model="colorCargo" type="color" />
        </label>

        <h2>Foliador</h2>
        <label class="pg__campo">
          <span>documento</span>
          <input v-model="documentoFolio" type="text" />
        </label>
        <label class="pg__campo">
          <span>pagina ({{ paginaFolio }})</span>
          <input v-model.number="paginaFolio" type="range" min="1" :max="totalFolio" step="1" />
        </label>
        <label class="pg__campo">
          <span>total ({{ totalFolio }})</span>
          <input v-model.number="totalFolio" type="range" min="1" max="20" step="1" />
        </label>
        <label class="pg__campo">
          <span>color</span>
          <input v-model="colorFolio" type="color" />
        </label>

        <h2>Código</h2>
        <pre class="pg__codigo">{{ codigoTramites }}</pre>
      </aside>
    </main>
  </div>
</template>

<style>
:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color-scheme: light;
}
* { box-sizing: border-box; }
body { margin: 0; background: #f8fafc; color: #0f172a; }

.pg { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem; }
.pg__header h1 { margin: 0 0 0.25rem; font-size: 1.6rem; }
.pg__header h1 small { color: #42b883; font-weight: 600; }
.pg__header p { margin: 0 0 2rem; color: #64748b; }

.pg__main {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 760px) {
  .pg__main { grid-template-columns: 1fr; }
}

.pg__preview,
.pg__panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.pg__papel {
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(#fff 0 0) padding-box,
    #fff;
  background-image:
    repeating-linear-gradient(#fff 0 31px, #eef2f7 31px 32px);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.pg__btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: #0f172a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s;
}
.pg__btn:active { transform: scale(0.97); }

.pg__panel h2 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin: 0 0 0.75rem;
}
.pg__panel h2:not(:first-child) { margin-top: 1.5rem; }

.pg__campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
}
.pg__campo input[type='text'],
.pg__campo select {
  padding: 0.45rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}
.pg__campo input[type='color'] {
  height: 2.2rem;
  padding: 2px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
}

.pg__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.pg__tabs button {
  padding: 0.45rem 1rem;
  font: inherit;
  font-weight: 600;
  color: #64748b;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  cursor: pointer;
}
.pg__tabs button.activa {
  color: #0f172a;
  border-color: #0f172a;
}

.pg__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.pg__presets button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  font: inherit;
  font-size: 0.8rem;
  color: #64748b;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  cursor: pointer;
}
.pg__presets button.activa {
  color: #0f172a;
  border-color: #0f172a;
}

.pg__columna {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  min-height: 380px;
  align-items: flex-start;
  padding: 1rem;
}

.pg__disparos { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.pg__disparo {
  padding: 0.5rem 0.8rem;
  font: inherit;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.pg__disparo--info { background: #2563eb; }
.pg__disparo--exito { background: #16a34a; }
.pg__disparo--alerta { background: #d97706; }
.pg__disparo--error { background: #dc2626; }

.pg__papel--tramites {
  flex-direction: column;
  gap: 2rem;
}

.pg__acciones {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
.pg__acciones .pg__btn { flex: 1; }

.pg__codigo {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.78rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}
</style>
