<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import './sello.css'

const props = defineProps({
  /** URL o data-URI de la imagen a sellar */
  imagen: { type: String, required: true },
  /** Tamaño en píxeles */
  tamano: { type: Number, default: 180 },
  /** Color de la tinta con que se tiñe la imagen */
  color: { type: String, default: '#dc2626' },
  /** forma: 'circular' | 'rectangular' */
  forma: { type: String, default: 'circular' },
  /** Inclinación del sello en grados */
  inclinacion: { type: Number, default: -12 },
  /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
  estampar: { type: Number, default: 0 },
  /** Escala de la imagen dentro del sello (0-1) */
  escala: { type: Number, default: 0.6 },
})

const emit = defineEmits(['sellado'])

const uid = `si-${Math.random().toString(36).slice(2, 8)}`
const estampando = ref(false)
let timer = null

const vars = computed(() => ({
  '--sello-size': `${props.tamano}px`,
  '--sello-color': props.color,
  '--sello-color-texto': props.color,
  '--sello-inclinacion': `${props.inclinacion}deg`,
}))

// descompone el color hex a componentes 0-1 para la matriz de tinte
const rgb = computed(() => {
  let h = props.color.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
})

// matriz que convierte la luminancia de la imagen al color elegido
const matrizTinte = computed(() => [
  0.2126 * rgb.value.r, 0.7152 * rgb.value.r, 0.0722 * rgb.value.r, 0, 0,
  0.2126 * rgb.value.g, 0.7152 * rgb.value.g, 0.0722 * rgb.value.g, 0, 0,
  0.2126 * rgb.value.b, 0.7152 * rgb.value.b, 0.0722 * rgb.value.b, 0, 0,
  0, 0, 0, 1, 0,
].join(' '))

const salpicaduras = [
  { x: -6, y: 8, s: 0.1, d: 0.3 },
  { x: 102, y: 12, s: 0.07, d: 0.36 },
  { x: -10, y: 88, s: 0.08, d: 0.42 },
  { x: 98, y: 92, s: 0.12, d: 0.26 },
]

function sellar() {
  clearTimeout(timer)
  estampando.value = false
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
    :aria-label="'Sello de imagen'"
    @click="sellar"
  >
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
      <svg class="sello__circulo" viewBox="0 0 100 100">
        <defs>
          <!-- tiñe la imagen: luminancia -> color elegido, más textura de tinta -->
          <filter :id="`${uid}-tinte`" x="-10%" y="-10%" width="120%" height="120%">
            <feColorMatrix type="matrix" :values="matrizTinte" result="tinte" />
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="ruido" />
            <feDisplacementMap in="tinte" in2="ruido" scale="2" />
          </filter>
          <clipPath :id="`${uid}-clip`">
            <circle v-if="forma === 'circular'" cx="50" cy="50" r="47" />
            <rect v-else x="4" y="4" width="92" height="92" rx="8" />
          </clipPath>
        </defs>

        <!-- marco del sello -->
        <circle v-if="forma === 'circular'" cx="50" cy="50" r="47" fill="none" :stroke="color" stroke-width="3" />
        <rect v-else x="4" y="4" width="92" height="92" rx="8" fill="none" :stroke="color" stroke-width="3" />

        <!-- imagen teñida -->
        <g :clip-path="`url(#${uid}-clip)`">
          <image
            :href="imagen"
            :x="50 - escala * 50"
            :y="50 - escala * 50"
            :width="escala * 100"
            :height="escala * 100"
            :filter="`url(#${uid}-tinte)`"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
