<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './chuspita.css'

const props = defineProps({
  /** Título corto de la notificación */
  titulo: { type: String, default: 'Información' },
  /** Mensaje de la notificación */
  mensaje: { type: String, default: '' },
  /** tipo: 'info' | 'exito' | 'alerta' | 'error' */
  tipo: { type: String, default: 'info' },
  /** Muestra el botón de cerrar */
  cerrable: { type: Boolean, default: true },
  /** Milisegundos hasta auto-cerrarse (0 = no auto-cerrar) */
  duracion: { type: Number, default: 0 },
  /** Cambia a un valor distinto para re-mostrar la notificación */
  mostrar: { type: Number, default: 0 },
})

const emit = defineEmits(['cerrada'])

const visible = ref(true)
const saliendo = ref(false)
let timers = []

const iconos = { info: 'i', exito: '✓', alerta: '!', error: '✕' }
const icono = computed(() => iconos[props.tipo] || 'i')

function limpiar() {
  timers.forEach(clearTimeout)
  timers = []
}

function cerrar() {
  if (saliendo.value) return
  saliendo.value = true
  timers.push(setTimeout(() => {
    visible.value = false
    emit('cerrada')
  }, 250))
}

function programarAuto() {
  if (props.duracion > 0) {
    limpiar()
    timers.push(setTimeout(cerrar, props.duracion))
  }
}

onMounted(programarAuto)
onBeforeUnmount(limpiar)
watch(() => props.mostrar, () => {
  limpiar()
  visible.value = true
  saliendo.value = false
  programarAuto()
})
</script>

<template>
  <div
    v-if="visible"
    class="chuspita"
    :class="[`chuspita--${tipo}`, { 'chuspita--saliendo': saliendo }]"
    role="alert"
  >
    <span class="chuspita__icono" aria-hidden="true">{{ icono }}</span>
    <div class="chuspita__cuerpo">
      <p class="chuspita__titulo">{{ titulo }}</p>
      <p v-if="mensaje" class="chuspita__mensaje">{{ mensaje }}</p>
    </div>
    <button v-if="cerrable" class="chuspita__cerrar" aria-label="Cerrar" @click="cerrar">✕</button>
  </div>
</template>
