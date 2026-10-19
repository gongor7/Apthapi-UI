<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import './tramites.css'

const props = defineProps({
  /** Título o código del documento foliado */
  documento: { type: String, default: 'EXPEDIENTE Nº 042' },
  /** Página actual */
  pagina: { type: Number, default: 1 },
  /** Total de páginas del documento */
  total: { type: Number, default: 10 },
  /** Color de la tinta */
  color: { type: String, default: '#0f172a' },
  /** Ancho en píxeles */
  tamano: { type: Number, default: 200 },
  /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
  estampar: { type: Number, default: 0 },
})

const emit = defineEmits(['sellado'])

const estampando = ref(false)
let timer = null

const paginas = computed(() => `Pág. ${props.pagina || 1} de ${props.total}`)

function sellar() {
  clearTimeout(timer)
  estampando.value = false
  requestAnimationFrame(() => {
    estampando.value = true
    emit('sellado')
    timer = setTimeout(() => (estampando.value = false), 700)
  })
}

defineExpose({ sellar })

onMounted(sellar)
watch(() => props.estampar, sellar)
watch(() => props.pagina, sellar)
</script>

<template>
  <div
    class="folio"
    :class="{ 'folio--estampando': estampando }"
    :style="{ '--folio-color': color, '--folio-size': `${tamano}px` }"
    role="img"
    :aria-label="paginas"
    @click="sellar"
  >
    <div class="folio__documento">{{ documento }}</div>
    <div class="folio__numeracion">
      <span class="folio__pagina">{{ paginas }}</span>
      <span>Folio legalizado</span>
    </div>
  </div>
</template>
