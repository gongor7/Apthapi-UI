<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import './tramites.css'

const props = defineProps({
  /** Nombre de la institución que recibe */
  institucion: { type: String, default: 'MINISTERIO DE EJEMPLO' },
  /** Funcionario que recibe el trámite */
  receptor: { type: String, default: 'Ing. J. Quispe' },
  /** Número de trámite/ruta */
  numeroTramite: { type: String, default: '000123/2026' },
  /** Fecha del cargo (por defecto, la actual) */
  fecha: { type: String, default: null },
  /** Hora del cargo (por defecto, la actual) */
  hora: { type: String, default: null },
  /** Color de la tinta */
  color: { type: String, default: '#1d4ed8' },
  /** Ancho en píxeles */
  tamano: { type: Number, default: 220 },
  /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
  estampar: { type: Number, default: 0 },
})

const emit = defineEmits(['sellado'])

const estampando = ref(false)
let timer = null

const ahora = new Date()
const fechaFinal = computed(
  () => props.fecha ?? `${String(ahora.getDate()).padStart(2, '0')}/${String(ahora.getMonth() + 1).padStart(2, '0')}/${ahora.getFullYear()}`
)
const horaFinal = computed(
  () => props.hora ?? `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
)

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
    class="cargo"
    :class="{ 'cargo--estampando': estampando }"
    :style="{ '--cargo-color': color, '--cargo-size': `${tamano}px` }"
    role="img"
    :aria-label="`Recibido con cargo: trámite ${numeroTramite}`"
    @click="sellar"
  >
    <div class="cargo__caja">
      <div class="cargo__titulo">Recibido con cargo</div>
      <div class="cargo__fila"><span class="cargo__etiqueta">Trámite</span><span class="cargo__valor">{{ numeroTramite }}</span></div>
      <div class="cargo__fila"><span class="cargo__etiqueta">Fecha</span><span class="cargo__valor">{{ fechaFinal }}</span></div>
      <div class="cargo__fila"><span class="cargo__etiqueta">Hora</span><span class="cargo__valor">{{ horaFinal }}</span></div>
      <div class="cargo__fila"><span class="cargo__etiqueta">Recibió</span><span class="cargo__valor">{{ receptor }}</span></div>
      <div class="cargo__fila"><span class="cargo__etiqueta">Entidad</span><span class="cargo__valor">{{ institucion }}</span></div>
    </div>
  </div>
</template>
