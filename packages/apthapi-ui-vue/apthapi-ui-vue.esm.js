import { ref as M, computed as _, onMounted as L, watch as E, openBlock as o, createElementBlock as n, normalizeStyle as w, normalizeClass as z, createElementVNode as t, Fragment as B, renderList as D, toDisplayString as g, createCommentVNode as F, nextTick as P, onBeforeUnmount as G } from "vue";
const J = ["aria-label"], Y = { class: "sello__papel" }, Q = {
  key: 0,
  class: "sello__circulo",
  viewBox: "0 0 100 100"
}, X = ["stroke"], K = ["stroke"], W = ["stroke"], ee = ["fill", "font-size"], te = {
  href: "#arco-superior",
  startOffset: "50%",
  "text-anchor": "middle"
}, ae = ["fill", "font-size"], le = {
  href: "#arco-inferior",
  startOffset: "50%",
  "text-anchor": "middle"
}, oe = ["y", "fill", "font-size"], ne = ["y"], se = {
  key: 0,
  class: "sello__sub"
}, V = 8.5, q = 16, Pe = {
  __name: "Sello",
  props: {
    /** Texto principal del sello */
    texto: { type: String, default: "APROBADO" },
    /** Texto curvo superior (solo forma circular) */
    textoArriba: { type: String, default: "REPÚBLICA DEL SELLO" },
    /** Texto curvo inferior (solo forma circular) */
    textoAbajo: { type: String, default: "OFICINA CENTRAL" },
    /** Tamaño en píxeles */
    tamano: { type: Number, default: 180 },
    /** Color del borde / tinta */
    color: { type: String, default: "#dc2626" },
    /** Color del texto (por defecto, igual al color) */
    colorTexto: { type: String, default: null },
    /** forma: 'circular' | 'rectangular' */
    forma: { type: String, default: "circular" },
    /** Inclinación del sello en grados */
    inclinacion: { type: Number, default: -12 },
    /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
    estampar: { type: Number, default: 0 }
  },
  emits: ["sellado"],
  setup(e, { expose: x, emit: $ }) {
    const a = e, b = $, l = M(!1);
    let c = null;
    const s = _(() => a.colorTexto || a.color), p = _(() => ({
      "--sello-size": `${a.tamano}px`,
      "--sello-color": a.color,
      "--sello-color-texto": s.value,
      "--sello-inclinacion": `${a.inclinacion}deg`
    })), i = M(null), d = M(null), C = M(V);
    function r() {
      P(() => {
        let k = 1;
        for (const m of [i.value, d.value]) {
          if (!m) continue;
          const u = m.getComputedTextLength();
          u && (k = Math.min(k, 119.4 * 0.86 / u));
        }
        C.value = Math.max(V * k, 3);
      });
    }
    function A(k, m = 10) {
      const u = String(k).trim().split(/\s+/), h = [];
      let S = "";
      for (const N of u)
        S ? (S + " " + N).length <= m ? S += " " + N : (h.push(S), S = N) : S = N;
      return S && h.push(S), h;
    }
    const f = _(() => A(a.texto)), v = M(null), y = M(q), T = _(() => y.value), I = _(() => T.value * 1.1);
    function O() {
      P(() => {
        const k = v.value;
        if (!k || !k.children.length) {
          y.value = q;
          return;
        }
        let m = 1;
        for (const h of k.children) {
          const S = h.getComputedTextLength();
          if (!S) continue;
          const N = Math.abs(parseFloat(h.getAttribute("y")) - 50), Z = 2 * Math.sqrt(Math.max(676 - N * N, 1));
          m = Math.min(m, Z / S);
        }
        let u = Math.min(q * m, 50 / (f.value.length * 1.1));
        y.value = Math.max(u, 4);
      });
    }
    L(() => {
      O(), r();
    }), E([() => a.texto, () => a.tamano, () => a.forma], O, { flush: "post" }), E([() => a.textoArriba, () => a.textoAbajo, () => a.tamano], r, { flush: "post" });
    const H = _(() => {
      const m = 82 / (Math.max(...f.value.map((h) => h.length), 1) * 0.62), u = 88 / (f.value.length * 1.15);
      return Math.min(q, m, u);
    }), U = [
      { x: -6, y: 8, s: 0.1, d: 0.3 },
      { x: 102, y: 12, s: 0.07, d: 0.36 },
      { x: -10, y: 88, s: 0.08, d: 0.42 },
      { x: 98, y: 92, s: 0.12, d: 0.26 },
      { x: 46, y: -8, s: 0.06, d: 0.48 },
      { x: 52, y: 104, s: 0.09, d: 0.32 }
    ];
    function j() {
      clearTimeout(c), l.value = !1, requestAnimationFrame(() => {
        l.value = !0, b("sellado"), c = setTimeout(() => l.value = !1, 800);
      });
    }
    return x({ sellar: j }), L(j), E(() => a.estampar, j), (k, m) => (o(), n("div", {
      class: z(["sello", { "sello--estampando": l.value }]),
      style: w(p.value),
      role: "img",
      "aria-label": `Sello: ${e.texto}`,
      onClick: j
    }, [
      m[1] || (m[1] = t("svg", {
        class: "sello-defs",
        "aria-hidden": "true"
      }, [
        t("defs", null, [
          t("filter", { id: "sello-textura" }, [
            t("feTurbulence", {
              type: "fractalNoise",
              baseFrequency: "0.9",
              numOctaves: "2",
              result: "ruido"
            }),
            t("feDisplacementMap", {
              in: "SourceGraphic",
              in2: "ruido",
              scale: "2.5"
            })
          ])
        ])
      ], -1)),
      (o(), n(B, null, D(U, (u, h) => t("span", {
        key: h,
        class: "sello__salpicadura",
        style: w({
          left: `${u.x}%`,
          top: `${u.y}%`,
          width: `${u.s * e.tamano}px`,
          height: `${u.s * e.tamano}px`,
          animationDelay: `${u.d}s`
        })
      }, null, 4)), 64)),
      t("div", Y, [
        e.forma === "circular" ? (o(), n("svg", Q, [
          m[0] || (m[0] = t("defs", null, [
            t("path", {
              id: "arco-superior",
              d: "M 50,50 m -38,0 a 38,38 0 1,1 76,0",
              fill: "none"
            }),
            t("path", {
              id: "arco-inferior",
              d: "M 50,50 m -38,0 a 38,38 0 1,0 76,0",
              fill: "none"
            })
          ], -1)),
          t("circle", {
            cx: "50",
            cy: "50",
            r: "47",
            fill: "none",
            stroke: e.color,
            "stroke-width": "3"
          }, null, 8, X),
          t("circle", {
            cx: "50",
            cy: "50",
            r: "42.5",
            fill: "none",
            stroke: e.color,
            "stroke-width": "1.5"
          }, null, 8, K),
          t("circle", {
            cx: "50",
            cy: "50",
            r: "28",
            fill: "none",
            stroke: e.color,
            "stroke-width": "1.5"
          }, null, 8, W),
          t("text", {
            ref_key: "arcoSupRef",
            ref: i,
            class: "sello__arco-texto",
            fill: s.value,
            "font-size": C.value,
            "dominant-baseline": "central"
          }, [
            t("textPath", te, g(e.textoArriba), 1)
          ], 8, ee),
          t("text", {
            ref_key: "arcoInfRef",
            ref: d,
            class: "sello__arco-texto",
            fill: s.value,
            "font-size": C.value,
            "dominant-baseline": "central"
          }, [
            t("textPath", le, g(e.textoAbajo), 1)
          ], 8, ae),
          t("text", {
            ref_key: "textoRef",
            ref: v,
            class: "sello__texto-central",
            x: "50",
            y: 50 - (f.value.length - 1) * I.value / 2,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            fill: s.value,
            "font-size": T.value
          }, [
            (o(!0), n(B, null, D(f.value, (u, h) => (o(), n("tspan", {
              key: h,
              x: "50",
              y: 50 - (f.value.length - 1) * I.value / 2 + h * I.value
            }, g(u), 9, ne))), 128))
          ], 8, oe)
        ])) : (o(), n("div", {
          key: 1,
          class: "sello__rectangulo",
          style: w({ "--sello-fuente": `${H.value / 100 * e.tamano}px` })
        }, [
          (o(!0), n(B, null, D(f.value, (u, h) => (o(), n("span", {
            key: h,
            class: "sello__texto-central"
          }, g(u), 1))), 128)),
          e.textoAbajo ? (o(), n("span", se, g(e.textoAbajo), 1)) : F("", !0)
        ], 4))
      ])
    ], 14, J));
  }
}, ie = { class: "sello__papel" }, re = {
  class: "sello__circulo",
  viewBox: "0 0 100 100"
}, ce = ["id"], ue = ["values"], de = ["id"], fe = {
  key: 0,
  cx: "50",
  cy: "50",
  r: "47"
}, me = {
  key: 1,
  x: "4",
  y: "4",
  width: "92",
  height: "92",
  rx: "8"
}, he = ["stroke"], ge = ["stroke"], pe = ["clip-path"], ve = ["href", "x", "y", "width", "height", "filter"], Ve = {
  __name: "SelloImagen",
  props: {
    /** URL o data-URI de la imagen a sellar */
    imagen: { type: String, required: !0 },
    /** Tamaño en píxeles */
    tamano: { type: Number, default: 180 },
    /** Color de la tinta con que se tiñe la imagen */
    color: { type: String, default: "#dc2626" },
    /** forma: 'circular' | 'rectangular' */
    forma: { type: String, default: "circular" },
    /** Inclinación del sello en grados */
    inclinacion: { type: Number, default: -12 },
    /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
    estampar: { type: Number, default: 0 },
    /** Escala de la imagen dentro del sello (0-1) */
    escala: { type: Number, default: 0.6 },
    /** Elimina el fondo: lo claro se vuelve transparente y solo queda la tinta */
    quitarFondo: { type: Boolean, default: !0 }
  },
  emits: ["sellado"],
  setup(e, { expose: x, emit: $ }) {
    const a = e, b = $, l = `si-${Math.random().toString(36).slice(2, 8)}`, c = M(!1);
    let s = null;
    const p = _(() => ({
      "--sello-size": `${a.tamano}px`,
      "--sello-color": a.color,
      "--sello-color-texto": a.color,
      "--sello-inclinacion": `${a.inclinacion}deg`
    })), i = _(() => {
      let f = a.color.replace("#", "");
      f.length === 3 && (f = f.split("").map((y) => y + y).join(""));
      const v = parseInt(f, 16);
      return { r: (v >> 16 & 255) / 255, g: (v >> 8 & 255) / 255, b: (v & 255) / 255 };
    }), d = _(() => [
      0.2126 * i.value.r,
      0.7152 * i.value.r,
      0.0722 * i.value.r,
      0,
      0,
      0.2126 * i.value.g,
      0.7152 * i.value.g,
      0.0722 * i.value.g,
      0,
      0,
      0.2126 * i.value.b,
      0.7152 * i.value.b,
      0.0722 * i.value.b,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ].join(" ")), C = _(() => [
      0,
      0,
      0,
      0,
      i.value.r,
      0,
      0,
      0,
      0,
      i.value.g,
      0,
      0,
      0,
      0,
      i.value.b,
      -0.2126,
      -0.7152,
      -0.0722,
      0,
      1
    ].join(" ")), r = [
      { x: -6, y: 8, s: 0.1, d: 0.3 },
      { x: 102, y: 12, s: 0.07, d: 0.36 },
      { x: -10, y: 88, s: 0.08, d: 0.42 },
      { x: 98, y: 92, s: 0.12, d: 0.26 }
    ];
    function A() {
      clearTimeout(s), c.value = !1, requestAnimationFrame(() => {
        c.value = !0, b("sellado"), s = setTimeout(() => c.value = !1, 800);
      });
    }
    return x({ sellar: A }), L(A), E(() => a.estampar, A), (f, v) => (o(), n("div", {
      class: z(["sello", { "sello--estampando": c.value }]),
      style: w(p.value),
      role: "img",
      "aria-label": "Sello de imagen",
      onClick: A
    }, [
      (o(), n(B, null, D(r, (y, T) => t("span", {
        key: T,
        class: "sello__salpicadura",
        style: w({
          left: `${y.x}%`,
          top: `${y.y}%`,
          width: `${y.s * e.tamano}px`,
          height: `${y.s * e.tamano}px`,
          animationDelay: `${y.d}s`
        })
      }, null, 4)), 64)),
      t("div", ie, [
        (o(), n("svg", re, [
          t("defs", null, [
            t("filter", {
              id: `${l}-tinte`,
              x: "-10%",
              y: "-10%",
              width: "120%",
              height: "120%",
              "color-interpolation-filters": "sRGB"
            }, [
              t("feColorMatrix", {
                type: "matrix",
                values: e.quitarFondo ? C.value : d.value,
                result: "tinte"
              }, null, 8, ue),
              v[0] || (v[0] = t("feTurbulence", {
                type: "fractalNoise",
                baseFrequency: "0.15",
                numOctaves: "2",
                result: "ruido"
              }, null, -1)),
              v[1] || (v[1] = t("feDisplacementMap", {
                in: "tinte",
                in2: "ruido",
                scale: "2"
              }, null, -1))
            ], 8, ce),
            t("clipPath", {
              id: `${l}-clip`
            }, [
              e.forma === "circular" ? (o(), n("circle", fe)) : (o(), n("rect", me))
            ], 8, de)
          ]),
          e.forma === "circular" ? (o(), n("circle", {
            key: 0,
            cx: "50",
            cy: "50",
            r: "47",
            fill: "none",
            stroke: e.color,
            "stroke-width": "3"
          }, null, 8, he)) : (o(), n("rect", {
            key: 1,
            x: "4",
            y: "4",
            width: "92",
            height: "92",
            rx: "8",
            fill: "none",
            stroke: e.color,
            "stroke-width": "3"
          }, null, 8, ge)),
          t("g", {
            "clip-path": `url(#${l}-clip)`
          }, [
            t("image", {
              href: e.imagen,
              x: 50 - e.escala * 50,
              y: 50 - e.escala * 50,
              width: e.escala * 100,
              height: e.escala * 100,
              filter: `url(#${l}-tinte)`,
              preserveAspectRatio: "xMidYMid meet"
            }, null, 8, ve)
          ], 8, pe)
        ]))
      ])
    ], 6));
  }
}, ye = {
  class: "chuspita__icono",
  "aria-hidden": "true"
}, _e = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, xe = ["d"], $e = { class: "chuspita__cuerpo" }, be = { class: "chuspita__titulo" }, ke = {
  key: 0,
  class: "chuspita__mensaje"
}, Se = {
  key: 1,
  class: "chuspita__progreso",
  "aria-hidden": "true"
}, He = {
  __name: "ChuspitaAlert",
  props: {
    /** Título corto de la notificación */
    titulo: { type: String, default: "Información" },
    /** Mensaje de la notificación */
    mensaje: { type: String, default: "" },
    /** tipo: 'info' | 'exito' | 'alerta' | 'error' */
    tipo: { type: String, default: "info" },
    /** Texto de un botón de acción opcional (ej. "Ver trámite") */
    accion: { type: String, default: null },
    /** Muestra el botón de cerrar */
    cerrable: { type: Boolean, default: !0 },
    /** Milisegundos hasta auto-cerrarse (0 = no auto-cerrar) */
    duracion: { type: Number, default: 0 },
    /** Cambia a un valor distinto para re-mostrar la notificación */
    mostrar: { type: Number, default: 0 }
  },
  emits: ["cerrada", "accion"],
  setup(e, { emit: x }) {
    const $ = e, a = x, b = M(!0), l = M(!1);
    let c = [], s = 0, p = 0;
    function i() {
      c.forEach(clearTimeout), c = [];
    }
    function d(T) {
      i(), !(T <= 0) && (s = T, p = Date.now(), c.push(setTimeout(v, T + 300)));
    }
    function C() {
      s <= 0 || (i(), s = Math.max(s - (Date.now() - p), 0));
    }
    function r() {
      s > 0 && b.value && !l.value && d(s);
    }
    const A = {
      info: "M12 8H12.01M11 12H12V16M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z",
      exito: "M20 6L9 17L4 12",
      alerta: "M12 9V13M12 17H12.01M10.3 3.9L1.8 18A2 2 0 0 0 3.5 21H20.5A2 2 0 0 0 22.2 18L13.7 3.9A2 2 0 0 0 10.3 3.9Z",
      error: "M15 9L9 15M9 9L15 15M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"
    }, f = _(() => A[$.tipo] || A.info);
    function v() {
      l.value || (l.value = !0, c.push(setTimeout(() => {
        b.value = !1, a("cerrada");
      }, 300)));
    }
    function y() {
      a("accion");
    }
    return L(() => d($.duracion)), G(i), E(() => $.mostrar, () => {
      i(), b.value = !0, l.value = !1, d($.duracion);
    }), (T, I) => b.value ? (o(), n("div", {
      key: 0,
      class: z(["chuspita", [`chuspita--${e.tipo}`, { "chuspita--saliendo": l.value }]]),
      style: w(e.duracion > 0 ? { "--chuspita-duracion": `${e.duracion}ms` } : null),
      role: "alert",
      onMouseenter: C,
      onMouseleave: r
    }, [
      t("span", ye, [
        (o(), n("svg", _e, [
          t("path", { d: f.value }, null, 8, xe)
        ]))
      ]),
      t("div", $e, [
        t("p", be, g(e.titulo), 1),
        e.mensaje ? (o(), n("p", ke, g(e.mensaje), 1)) : F("", !0),
        e.accion ? (o(), n("button", {
          key: 1,
          class: "chuspita__accion",
          onClick: y
        }, g(e.accion), 1)) : F("", !0)
      ]),
      e.cerrable ? (o(), n("button", {
        key: 0,
        class: "chuspita__cerrar",
        "aria-label": "Cerrar",
        onClick: v
      }, "✕")) : F("", !0),
      e.duracion > 0 ? (o(), n("span", Se)) : F("", !0)
    ], 38)) : F("", !0);
  }
}, Me = ["aria-label"], Ae = { class: "cargo__caja" }, Te = { class: "cargo__fila" }, Ce = { class: "cargo__valor" }, Ee = { class: "cargo__fila" }, we = { class: "cargo__valor" }, Ne = { class: "cargo__fila" }, Fe = { class: "cargo__valor" }, Le = { class: "cargo__fila" }, Re = { class: "cargo__valor" }, ze = { class: "cargo__fila" }, Ie = { class: "cargo__valor" }, Ue = {
  __name: "CargoRecepcion",
  props: {
    /** Nombre de la institución que recibe */
    institucion: { type: String, default: "MINISTERIO DE EJEMPLO" },
    /** Funcionario que recibe el trámite */
    receptor: { type: String, default: "Ing. J. Quispe" },
    /** Número de trámite/ruta */
    numeroTramite: { type: String, default: "000123/2026" },
    /** Fecha del cargo (por defecto, la actual) */
    fecha: { type: String, default: null },
    /** Hora del cargo (por defecto, la actual) */
    hora: { type: String, default: null },
    /** Color de la tinta */
    color: { type: String, default: "#1d4ed8" },
    /** Ancho en píxeles */
    tamano: { type: Number, default: 220 },
    /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
    estampar: { type: Number, default: 0 }
  },
  emits: ["sellado"],
  setup(e, { expose: x, emit: $ }) {
    const a = e, b = $, l = M(!1);
    let c = null;
    const s = /* @__PURE__ */ new Date(), p = _(
      () => a.fecha ?? `${String(s.getDate()).padStart(2, "0")}/${String(s.getMonth() + 1).padStart(2, "0")}/${s.getFullYear()}`
    ), i = _(
      () => a.hora ?? `${String(s.getHours()).padStart(2, "0")}:${String(s.getMinutes()).padStart(2, "0")}`
    );
    function d() {
      clearTimeout(c), l.value = !1, requestAnimationFrame(() => {
        l.value = !0, b("sellado"), c = setTimeout(() => l.value = !1, 800);
      });
    }
    return x({ sellar: d }), L(d), E(() => a.estampar, d), (C, r) => (o(), n("div", {
      class: z(["cargo", { "cargo--estampando": l.value }]),
      style: w({ "--cargo-color": e.color, "--cargo-size": `${e.tamano}px` }),
      role: "img",
      "aria-label": `Recibido con cargo: trámite ${e.numeroTramite}`,
      onClick: d
    }, [
      t("div", Ae, [
        r[5] || (r[5] = t("div", { class: "cargo__titulo" }, "Recibido con cargo", -1)),
        t("div", Te, [
          r[0] || (r[0] = t("span", { class: "cargo__etiqueta" }, "Trámite", -1)),
          t("span", Ce, g(e.numeroTramite), 1)
        ]),
        t("div", Ee, [
          r[1] || (r[1] = t("span", { class: "cargo__etiqueta" }, "Fecha", -1)),
          t("span", we, g(p.value), 1)
        ]),
        t("div", Ne, [
          r[2] || (r[2] = t("span", { class: "cargo__etiqueta" }, "Hora", -1)),
          t("span", Fe, g(i.value), 1)
        ]),
        t("div", Le, [
          r[3] || (r[3] = t("span", { class: "cargo__etiqueta" }, "Recibió", -1)),
          t("span", Re, g(e.receptor), 1)
        ]),
        t("div", ze, [
          r[4] || (r[4] = t("span", { class: "cargo__etiqueta" }, "Entidad", -1)),
          t("span", Ie, g(e.institucion), 1)
        ])
      ])
    ], 14, Me));
  }
}, je = ["aria-label"], qe = { class: "folio__documento" }, Be = { class: "folio__numeracion" }, De = { class: "folio__pagina" }, Ze = {
  __name: "Foliador",
  props: {
    /** Título o código del documento foliado */
    documento: { type: String, default: "EXPEDIENTE Nº 042" },
    /** Página actual */
    pagina: { type: Number, default: 1 },
    /** Total de páginas del documento */
    total: { type: Number, default: 10 },
    /** Color de la tinta */
    color: { type: String, default: "#0f172a" },
    /** Ancho en píxeles */
    tamano: { type: Number, default: 200 },
    /** Dispara un nuevo sellado cada vez que cambia a un valor distinto */
    estampar: { type: Number, default: 0 }
  },
  emits: ["sellado"],
  setup(e, { expose: x, emit: $ }) {
    const a = e, b = $, l = M(!1);
    let c = null;
    const s = _(() => `Pág. ${a.pagina || 1} de ${a.total}`);
    function p() {
      clearTimeout(c), l.value = !1, requestAnimationFrame(() => {
        l.value = !0, b("sellado"), c = setTimeout(() => l.value = !1, 700);
      });
    }
    return x({ sellar: p }), L(p), E(() => a.estampar, p), E(() => a.pagina, p), (i, d) => (o(), n("div", {
      class: z(["folio", { "folio--estampando": l.value }]),
      style: w({ "--folio-color": e.color, "--folio-size": `${e.tamano}px` }),
      role: "img",
      "aria-label": s.value,
      onClick: p
    }, [
      t("div", qe, g(e.documento), 1),
      t("div", Be, [
        t("span", De, g(s.value), 1),
        d[0] || (d[0] = t("span", null, "Folio legalizado", -1))
      ])
    ], 14, je));
  }
}, R = (e, x = 24) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} ${x}">${e}</svg>`
)}`, Ge = [
  {
    nombre: "Estrella",
    imagen: R(
      '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="#000"/>'
    )
  },
  {
    nombre: "Check",
    imagen: R('<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>')
  },
  {
    nombre: "Corazón",
    imagen: R(
      '<path d="M12 21s-8.4-5.4-10.3-10C.4 7.6 2.6 4 6.2 4c2.3 0 4 1.3 5.8 3.4C13.8 5.3 15.5 4 17.8 4c3.6 0 5.8 3.6 4.5 7-1.9 4.6-10.3 10-10.3 10z" fill="#000"/>'
    )
  },
  {
    nombre: "Rayo",
    imagen: R('<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#000"/>')
  },
  {
    nombre: "Avión",
    imagen: R(
      '<path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#000"/>'
    )
  }
];
export {
  Ue as CargoRecepcion,
  He as ChuspitaAlert,
  Ze as Foliador,
  Ge as PRESETS,
  Pe as Sello,
  Ve as SelloImagen,
  Pe as default
};
