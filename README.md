# 🔖 Apthapi UI

> *"Apthapi"* es la reunión andina boliviana donde cada quien aporta algo.
> Esta librería es eso: una colección de aportes (componentes) para **digitalizar las acciones típicas de las instituciones públicas**: sellar, refrendar, foliar, dar cargo y notificar.

Componentes disponibles en **Vue 3** y **React/Next.js**, con la misma API en ambos.

| Componente | Qué digitaliza | Props principales |
|---|---|---|
| `Sello` | El sello de goma institucional (circular o rectangular, con texto en arco) | `texto`, `textoArriba`, `textoAbajo`, `tamano`, `color`, `colorTexto`, `forma`, `inclinacion` |
| `SelloImagen` | Sello de logotipo: recibe una imagen y la tiñe del color elegido | `imagen`, `color`, `forma`, `tamano`, `escala` |
| `CargoRecepcion` | El "RECIBIDO CON CARGO" de ventanilla: fecha, hora, trámite y receptor | `numeroTramite`, `receptor`, `institucion`, `fecha`, `hora` |
| `Foliador` | El foliado legal de expedientes: "Pág. X de Y" | `documento`, `pagina`, `total` |
| `ChuspitaAlert` | Notificaciones institucionales con cinta tejida | `titulo`, `mensaje`, `tipo` (info/exito/alerta/error), `duracion` |

Todos los sellos comparten la **animación de sellado** (impacto con giro, rebote del papel, salpicaduras de tinta y textura irregular de tinta) y se disparan:
- al montar,
- al hacer clic sobre el sello,
- desde fuera, cambiando la prop `estampar`.

## Estructura

```
sello-vue/    → librería + playground (Vue 3 + Vite)   → npm run dev (puerto 5173)
sello-next/   → librería + playground (Next.js 15)     → npm run dev (puerto 3000)
```

Cada playground es estilo documentación interactiva (como Nuxt UI): vista previa en vivo a la izquierda, controles de props y código generado a la derecha.

## Uso (Vue)

```vue
<script setup>
import { Sello, CargoRecepcion } from './src/lib'
</script>

<template>
  <Sello texto="APROBADO" :tamano="200" color="#dc2626" forma="circular" />
  <CargoRecepcion numero-tramite="000123/2026" receptor="Ing. J. Quispe" />
</template>
```

## Uso (React / Next.js)

```jsx
import { Sello, CargoRecepcion } from '../lib'

<Sello texto="APROBADO" tamano={200} color="#dc2626" forma="circular" />
<CargoRecepcion numeroTramite="000123/2026" receptor="Ing. J. Quispe" />
```

## Roadmap de acciones institucionales por digitalizar

- [ ] `FirmaDigital` — firma manuscrita en canvas
- [ ] `SelloVerificable` — sello con QR de autenticidad
- [ ] `ActaTemplate` — plantillas de actas y certificados

---

Creado por **[Cristhian Leandro Góngora Torrez](https://www.linkedin.com/in/cristhian-leandro-g%C3%B3ngora-torrez-537496215/)** — desarrollador full stack, Bolivia 🇧🇴 · [GitHub](https://github.com/gongor7)

Hecho con 🇧🇴 en Bolivia.
