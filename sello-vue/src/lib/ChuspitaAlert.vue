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
  /** Texto de un botón de acción opcional (ej. "Ver trámite") */
  accion: { type: String, default: null },
  /** Muestra el botón de cerrar */
  cerrable: { type: Boolean, default: true },
  /** Milisegundos hasta auto-cerrarse (0 = no auto-cerrar) */
  duracion: { type: Number, default: 0 },
  /** Cambia a un valor distinto para re-mostrar la notificación */
  mostrar: { type: Number, default: 0 },
})

const emit = defineEmits(['cerrada', 'accion'])

const visible = ref(true)
const saliendo = ref(false)
let timers = []
let restante = 0
let iniciadoEn = 0

function limpiar() {
  timers.forEach(clearTimeout)
  timers = []
}

function programarCierre(ms) {
  limpiar()
  if (ms <= 0) return
  restante = ms
  iniciadoEn = Date.now()
  timers.push(setTimeout(cerrar, ms + 300))
}

function alEntrar() {
  if (restante <= 0) return
  limpiar()
  restante = Math.max(restante - (Date.now() - iniciadoEn), 0)
}

function alSalir() {
  if (restante > 0 && visible.value && !saliendo.value) programarCierre(restante)
}

const iconos = {
  info: 'M12 8H12.01M11 12H12V16M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z',
  exito: 'M20 6L9 17L4 12',
  alerta: 'M12 9V13M12 17H12.01M10.3 3.9L1.8 18A2 2 0 0 0 3.5 21H20.5A2 2 0 0 0 22.2 18L13.7 3.9A2 2 0 0 0 10.3 3.9Z',
  error: 'M15 9L9 15M9 9L15 15M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z',
}
const trazoIcono = computed(() => iconos[props.tipo] || iconos.info)

function cerrar() {
  if (saliendo.value) return
  saliendo.value = true
  timers.push(setTimeout(() => {
    visible.value = false
    emit('cerrada')
  }, 300))
}

function alAccion() {
  emit('accion')
}

onMounted(() => programarCierre(props.duracion))
onBeforeUnmount(limpiar)
watch(() => props.mostrar, () => {
  limpiar()
  visible.value = true
  saliendo.value = false
  programarCierre(props.duracion)
})
</script>

<template>
  <div
    v-if="visible"
    class="chuspita"
    :class="[`chuspita--${tipo}`, { 'chuspita--saliendo': saliendo }]"
    :style="duracion > 0 ? { '--chuspita-duracion': `${duracion}ms` } : null"
    role="alert"
    @mouseenter="alEntrar"
    @mouseleave="alSalir"
  >
    <span class="chuspita__icono" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path :d="trazoIcono" />
      </svg>
    </span>
    <div class="chuspita__cuerpo">
      <p class="chuspita__titulo">{{ titulo }}</p>
      <p v-if="mensaje" class="chuspita__mensaje">{{ mensaje }}</p>
      <button v-if="accion" class="chuspita__accion" @click="alAccion">{{ accion }}</button>
    </div>
    <button v-if="cerrable" class="chuspita__cerrar" aria-label="Cerrar" @click="cerrar">✕</button>
    <span v-if="duracion > 0" class="chuspita__progreso" aria-hidden="true" />
  </div>
</template>
