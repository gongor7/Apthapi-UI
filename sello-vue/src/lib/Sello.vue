<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import './sello.css'

const props = defineProps({
  /** Texto principal del sello */
  texto: { type: String, default: 'APROBADO' },
  /** Texto curvo superior (solo forma circular) */
  textoArriba: { type: String, default: 'REPÚBLICA DEL SELLO' },
  /** Texto curvo inferior (solo forma circular) */
  textoAbajo: { type: String, default: 'OFICINA CENTRAL' },
  /** Tamaño en píxeles */
  tamano: { type: Number, default: 180 },
  /** Color del borde / tinta */
  color: { type: String, default: '#dc2626' },
  /** Color del texto (por defecto, igual al color) */
  colorTexto: { type: String, default: null },
  /** forma: 'circular' | 'rectangular' */
  forma: { type: String, default: 'circular' },
  /** Inclinación del sello en grados */
  inclinacion: { type: Number, default: -12 },
  /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
  estampar: { type: Number, default: 0 },
})

const emit = defineEmits(['sellado'])

const estampando = ref(false)
let timer = null

const colorTextoFinal = computed(() => props.colorTexto || props.color)

const vars = computed(() => ({
  '--sello-size': `${props.tamano}px`,
  '--sello-color': props.color,
  '--sello-color-texto': colorTextoFinal.value,
  '--sello-inclinacion': `${props.inclinacion}deg`,
}))

// fuente del arco: se encoge si el texto no cabe en el semicírculo (~119 unidades)
const fuenteArco = computed(() => {
  const maxLen = Math.max(props.textoArriba.length, props.textoAbajo.length, 1)
  const porAncho = 110 / (maxLen * 0.9)
  return Math.min(0.085, porAncho) * props.tamano
})

// parte el texto en líneas de máx. `max` caracteres para que no desborde
function partirTexto(t, max = 10) {
  const palabras = String(t).trim().split(/\s+/)
  const lineas = []
  let actual = ''
  for (const p of palabras) {
    if (!actual) actual = p
    else if ((actual + ' ' + p).length <= max) actual += ' ' + p
    else {
      lineas.push(actual)
      actual = p
    }
  }
  if (actual) lineas.push(actual)
  return lineas
}

const lineas = computed(() => partirTexto(props.texto))

// Fuente del texto central, medida en unidades del viewBox (0-100).
// Se mide el texto REAL renderizado y se encoge hasta que quepa en el
// círculo interior (r=26): garantiza centrado y que nunca desborde.
const FUENTE_BASE = 16
const textoRef = ref(null)
const fuenteUnidades = ref(FUENTE_BASE)

const fuenteCentral = computed(() => fuenteUnidades.value)
const altoLinea = computed(() => fuenteCentral.value * 1.1)

function medirTexto() {
  nextTick(() => {
    const texto = textoRef.value
    if (!texto || !texto.children.length) {
      fuenteUnidades.value = FUENTE_BASE
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
    let unidades = Math.min(FUENTE_BASE * factor, 50 / (lineas.value.length * 1.1))
    fuenteUnidades.value = Math.max(unidades, 4)
  })
}

onMounted(medirTexto)
watch([() => props.texto, () => props.tamano, () => props.forma], medirTexto, { flush: 'post' })

// fuente para la forma rectangular (hecho por fórmula; el contenedor envuelve solo)
const fuenteRectangular = computed(() => {
  const masLarga = Math.max(...lineas.value.map((l) => l.length), 1)
  const porAncho = 82 / (masLarga * 0.62)
  const porAlto = 88 / (lineas.value.length * 1.15)
  return Math.min(FUENTE_BASE, porAncho, porAlto)
})

// posiciones fijas semi-aleatorias para las salpicaduras de tinta
const salpicaduras = [
  { x: -6, y: 8, s: 0.10, d: 0.30 },
  { x: 102, y: 12, s: 0.07, d: 0.36 },
  { x: -10, y: 88, s: 0.08, d: 0.42 },
  { x: 98, y: 92, s: 0.12, d: 0.26 },
  { x: 46, y: -8, s: 0.06, d: 0.48 },
  { x: 52, y: 104, s: 0.09, d: 0.32 },
]

function sellar() {
  clearTimeout(timer)
  estampando.value = false
  // fuerza reinicio de la animación en el siguiente frame
  requestAnimationFrame(() => {
    estampando.value = true
    emit('sellado')
    timer = setTimeout(() => (estampando.value = false), 800)
  })
}

defineExpose({ sellar })

onMounted(sellar)
watch(() => props.estampar, sellar)
</script>

<template>
  <div
    class="sello"
    :class="{ 'sello--estampando': estampando }"
    :style="vars"
    role="img"
    :aria-label="`Sello: ${texto}`"
    @click="sellar"
  >
    <!-- filtro de textura de tinta -->
    <svg class="sello-defs" aria-hidden="true">
      <defs>
        <filter id="sello-textura">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="2.5" />
        </filter>
      </defs>
    </svg>

    <!-- salpicaduras de tinta -->
    <span
      v-for="(p, i) in salpicaduras"
      :key="i"
      class="sello__salpicadura"
      :style="{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.s * tamano}px`,
        height: `${p.s * tamano}px`,
        animationDelay: `${p.d}s`,
      }"
    />

    <div class="sello__papel">
      <svg v-if="forma === 'circular'" class="sello__circulo" viewBox="0 0 100 100">
        <defs>
          <path id="arco-superior" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0" fill="none" />
          <path id="arco-inferior" d="M 50,50 m -38,0 a 38,38 0 1,0 76,0" fill="none" />
        </defs>
        <circle cx="50" cy="50" r="47" fill="none" :stroke="color" stroke-width="3" />
        <circle cx="50" cy="50" r="42.5" fill="none" :stroke="color" stroke-width="1.5" />
        <circle cx="50" cy="50" r="28" fill="none" :stroke="color" stroke-width="1.5" />
        <text class="sello__arco-texto" :fill="colorTextoFinal" :font-size="fuenteArco">
          <textPath href="#arco-superior" startOffset="50%" text-anchor="middle">
            {{ textoArriba }}
          </textPath>
        </text>
        <text class="sello__arco-texto" :fill="colorTextoFinal" :font-size="fuenteArco">
          <textPath href="#arco-inferior" startOffset="50%" text-anchor="middle">
            {{ textoAbajo }}
          </textPath>
        </text>
        <text
          ref="textoRef"
          class="sello__texto-central"
          x="50"
          :y="50 - ((lineas.length - 1) * altoLinea) / 2"
          text-anchor="middle"
          dominant-baseline="central"
          :fill="colorTextoFinal"
          :font-size="fuenteCentral"
        >
          <tspan v-for="(l, i) in lineas" :key="i" x="50" :y="50 - ((lineas.length - 1) * altoLinea) / 2 + i * altoLinea">
            {{ l }}
          </tspan>
        </text>
      </svg>

      <div v-else class="sello__rectangulo" :style="{ '--sello-fuente': `${(fuenteRectangular / 100) * tamano}px` }">
        <span v-for="(l, i) in lineas" :key="i" class="sello__texto-central">{{ l }}</span>
        <span v-if="textoAbajo" class="sello__sub">{{ textoAbajo }}</span>
      </div>
    </div>
  </div>
</template>
