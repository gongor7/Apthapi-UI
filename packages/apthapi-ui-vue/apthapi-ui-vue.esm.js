import { ref as M, computed as y, onMounted as R, watch as w, openBlock as l, createElementBlock as n, normalizeStyle as N, normalizeClass as I, createElementVNode as e, Fragment as B, renderList as D, toDisplayString as p, createCommentVNode as L, nextTick as P, onBeforeUnmount as G } from "vue";
const J = ["aria-label"], Y = { class: "sello__papel" }, Q = {
  key: 0,
  class: "sello__circulo",
  viewBox: "0 0 100 100"
}, X = ["stroke"], K = ["stroke"], W = ["stroke"], ee = ["fill", "font-size"], te = {
  href: "#arco-superior",
  startOffset: "50%",
  "text-anchor": "middle"
}, ae = ["fill", "font-size"], oe = {
  href: "#arco-inferior",
  startOffset: "50%",
  "text-anchor": "middle"
}, le = ["y", "fill", "font-size"], ne = ["y"], se = {
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
  setup(t, { expose: x, emit: $ }) {
    const a = t, b = $, o = M(!1);
    let c = null;
    const s = y(() => a.colorTexto || a.color), g = y(() => ({
      "--sello-size": `${a.tamano}px`,
      "--sello-color": a.color,
      "--sello-color-texto": s.value,
      "--sello-inclinacion": `${a.inclinacion}deg`
    })), i = M(null), d = M(null), E = M(V);
    function r() {
      P(() => {
        let k = 1;
        for (const f of [i.value, d.value]) {
          if (!f) continue;
          const u = f.getComputedTextLength();
          u && (k = Math.min(k, 119.4 * 0.86 / u));
        }
        E.value = Math.max(V * k, 3);
      });
    }
    function T(k, f = 10) {
      const u = String(k).trim().split(/\s+/), h = [];
      let S = "";
      for (const F of u)
        S ? (S + " " + F).length <= f ? S += " " + F : (h.push(S), S = F) : S = F;
      return S && h.push(S), h;
    }
    const m = y(() => T(a.texto)), v = M(null), _ = M(q), C = y(() => _.value), A = y(() => C.value * 1.1);
    function O() {
      P(() => {
        const k = v.value;
        if (!k || !k.children.length) {
          _.value = q;
          return;
        }
        let f = 1;
        for (const h of k.children) {
          const S = h.getComputedTextLength();
          if (!S) continue;
          const F = Math.abs(parseFloat(h.getAttribute("y")) - 50), Z = 2 * Math.sqrt(Math.max(676 - F * F, 1));
          f = Math.min(f, Z / S);
        }
        let u = Math.min(q * f, 50 / (m.value.length * 1.1));
        _.value = Math.max(u, 4);
      });
    }
    R(() => {
      O(), r();
    }), w([() => a.texto, () => a.tamano, () => a.forma], O, { flush: "post" }), w([() => a.textoArriba, () => a.textoAbajo, () => a.tamano], r, { flush: "post" });
    const H = y(() => {
      const f = 82 / (Math.max(...m.value.map((h) => h.length), 1) * 0.62), u = 88 / (m.value.length * 1.15);
      return Math.min(q, f, u);
    }), U = [
      { x: -6, y: 8, s: 0.1, d: 0.3 },
      { x: 102, y: 12, s: 0.07, d: 0.36 },
      { x: -10, y: 88, s: 0.08, d: 0.42 },
      { x: 98, y: 92, s: 0.12, d: 0.26 },
      { x: 46, y: -8, s: 0.06, d: 0.48 },
      { x: 52, y: 104, s: 0.09, d: 0.32 }
    ];
    function j() {
      clearTimeout(c), o.value = !1, requestAnimationFrame(() => {
        o.value = !0, b("sellado"), c = setTimeout(() => o.value = !1, 800);
      });
    }
    return x({ sellar: j }), R(j), w(() => a.estampar, j), (k, f) => (l(), n("div", {
      class: I(["sello", { "sello--estampando": o.value }]),
      style: N(g.value),
      role: "img",
      "aria-label": `Sello: ${t.texto}`,
      onClick: j
    }, [
      f[1] || (f[1] = e("svg", {
        class: "sello-defs",
        "aria-hidden": "true"
      }, [
        e("defs", null, [
          e("filter", { id: "sello-textura" }, [
            e("feTurbulence", {
              type: "fractalNoise",
              baseFrequency: "0.9",
              numOctaves: "2",
              result: "ruido"
            }),
            e("feDisplacementMap", {
              in: "SourceGraphic",
              in2: "ruido",
              scale: "2.5"
            })
          ])
        ])
      ], -1)),
      (l(), n(B, null, D(U, (u, h) => e("span", {
        key: h,
        class: "sello__salpicadura",
        style: N({
          left: `${u.x}%`,
          top: `${u.y}%`,
          width: `${u.s * t.tamano}px`,
          height: `${u.s * t.tamano}px`,
          animationDelay: `${u.d}s`
        })
      }, null, 4)), 64)),
      e("div", Y, [
        t.forma === "circular" ? (l(), n("svg", Q, [
          f[0] || (f[0] = e("defs", null, [
            e("path", {
              id: "arco-superior",
              d: "M 50,50 m -38,0 a 38,38 0 1,1 76,0",
              fill: "none"
            }),
            e("path", {
              id: "arco-inferior",
              d: "M 50,50 m -38,0 a 38,38 0 1,0 76,0",
              fill: "none"
            })
          ], -1)),
          e("circle", {
            cx: "50",
            cy: "50",
            r: "47",
            fill: "none",
            stroke: t.color,
            "stroke-width": "3"
          }, null, 8, X),
          e("circle", {
            cx: "50",
            cy: "50",
            r: "42.5",
            fill: "none",
            stroke: t.color,
            "stroke-width": "1.5"
          }, null, 8, K),
          e("circle", {
            cx: "50",
            cy: "50",
            r: "28",
            fill: "none",
            stroke: t.color,
            "stroke-width": "1.5"
          }, null, 8, W),
          e("text", {
            ref_key: "arcoSupRef",
            ref: i,
            class: "sello__arco-texto",
            fill: s.value,
            "font-size": E.value,
            "dominant-baseline": "central"
          }, [
            e("textPath", te, p(t.textoArriba), 1)
          ], 8, ee),
          e("text", {
            ref_key: "arcoInfRef",
            ref: d,
            class: "sello__arco-texto",
            fill: s.value,
            "font-size": E.value,
            "dominant-baseline": "central"
          }, [
            e("textPath", oe, p(t.textoAbajo), 1)
          ], 8, ae),
          e("text", {
            ref_key: "textoRef",
            ref: v,
            class: "sello__texto-central",
            x: "50",
            y: 50 - (m.value.length - 1) * A.value / 2,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            fill: s.value,
            "font-size": C.value
          }, [
            (l(!0), n(B, null, D(m.value, (u, h) => (l(), n("tspan", {
              key: h,
              x: "50",
              y: 50 - (m.value.length - 1) * A.value / 2 + h * A.value
            }, p(u), 9, ne))), 128))
          ], 8, le)
        ])) : (l(), n("div", {
          key: 1,
          class: "sello__rectangulo",
          style: N({ "--sello-fuente": `${H.value / 100 * t.tamano}px` })
        }, [
          (l(!0), n(B, null, D(m.value, (u, h) => (l(), n("span", {
            key: h,
            class: "sello__texto-central"
          }, p(u), 1))), 128)),
          t.textoAbajo ? (l(), n("span", se, p(t.textoAbajo), 1)) : L("", !0)
        ], 4))
      ])
    ], 14, J));
  }
}, ie = { class: "sello__papel" }, re = {
  class: "sello__circulo",
  viewBox: "0 0 100 100"
}, ce = ["id"], ue = ["values"], de = ["id"], me = {
  key: 0,
  cx: "50",
  cy: "50",
  r: "47"
}, fe = {
  key: 1,
  x: "4",
  y: "4",
  width: "92",
  height: "92",
  rx: "8"
}, he = ["stroke"], pe = ["stroke"], ge = ["clip-path"], ve = ["href", "x", "y", "width", "height", "filter"], Ve = {
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
  setup(t, { expose: x, emit: $ }) {
    const a = t, b = $, o = `si-${Math.random().toString(36).slice(2, 8)}`, c = M(!1);
    let s = null;
    const g = y(() => ({
      "--sello-size": `${a.tamano}px`,
      "--sello-color": a.color,
      "--sello-color-texto": a.color,
      "--sello-inclinacion": `${a.inclinacion}deg`
    })), i = y(() => {
      let m = a.color.replace("#", "");
      m.length === 3 && (m = m.split("").map((_) => _ + _).join(""));
      const v = parseInt(m, 16);
      return { r: (v >> 16 & 255) / 255, g: (v >> 8 & 255) / 255, b: (v & 255) / 255 };
    }), d = y(() => [
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
    ].join(" ")), E = y(() => [
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
    function T() {
      clearTimeout(s), c.value = !1, requestAnimationFrame(() => {
        c.value = !0, b("sellado"), s = setTimeout(() => c.value = !1, 800);
      });
    }
    return x({ sellar: T }), R(T), w(() => a.estampar, T), (m, v) => (l(), n("div", {
      class: I(["sello", { "sello--estampando": c.value }]),
      style: N(g.value),
      role: "img",
      "aria-label": "Sello de imagen",
      onClick: T
    }, [
      (l(), n(B, null, D(r, (_, C) => e("span", {
        key: C,
        class: "sello__salpicadura",
        style: N({
          left: `${_.x}%`,
          top: `${_.y}%`,
          width: `${_.s * t.tamano}px`,
          height: `${_.s * t.tamano}px`,
          animationDelay: `${_.d}s`
        })
      }, null, 4)), 64)),
      e("div", ie, [
        (l(), n("svg", re, [
          e("defs", null, [
            e("filter", {
              id: `${o}-tinte`,
              x: "-10%",
              y: "-10%",
              width: "120%",
              height: "120%",
              "color-interpolation-filters": "sRGB"
            }, [
              e("feColorMatrix", {
                type: "matrix",
                values: t.quitarFondo ? E.value : d.value,
                result: "tinte"
              }, null, 8, ue),
              v[0] || (v[0] = e("feTurbulence", {
                type: "fractalNoise",
                baseFrequency: "0.15",
                numOctaves: "2",
                result: "ruido"
              }, null, -1)),
              v[1] || (v[1] = e("feDisplacementMap", {
                in: "tinte",
                in2: "ruido",
                scale: "2"
              }, null, -1))
            ], 8, ce),
            e("clipPath", {
              id: `${o}-clip`
            }, [
              t.forma === "circular" ? (l(), n("circle", me)) : (l(), n("rect", fe))
            ], 8, de)
          ]),
          t.forma === "circular" ? (l(), n("circle", {
            key: 0,
            cx: "50",
            cy: "50",
            r: "47",
            fill: "none",
            stroke: t.color,
            "stroke-width": "3"
          }, null, 8, he)) : (l(), n("rect", {
            key: 1,
            x: "4",
            y: "4",
            width: "92",
            height: "92",
            rx: "8",
            fill: "none",
            stroke: t.color,
            "stroke-width": "3"
          }, null, 8, pe)),
          e("g", {
            "clip-path": `url(#${o}-clip)`
          }, [
            e("image", {
              href: t.imagen,
              x: 50 - t.escala * 50,
              y: 50 - t.escala * 50,
              width: t.escala * 100,
              height: t.escala * 100,
              filter: `url(#${o}-tinte)`,
              preserveAspectRatio: "xMidYMid meet"
            }, null, 8, ve)
          ], 8, ge)
        ]))
      ])
    ], 6));
  }
}, _e = {
  class: "chuspita__icono",
  "aria-hidden": "true"
}, ye = {
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
  setup(t, { emit: x }) {
    const $ = t, a = x, b = M(!0), o = M(!1);
    let c = [], s = 0, g = 0;
    function i() {
      c.forEach(clearTimeout), c = [];
    }
    function d(C) {
      i(), !(C <= 0) && (s = C, g = Date.now(), c.push(setTimeout(v, C + 300)));
    }
    function E() {
      s <= 0 || (i(), s = Math.max(s - (Date.now() - g), 0));
    }
    function r() {
      s > 0 && b.value && !o.value && d(s);
    }
    const T = {
      info: "M12 8H12.01M11 12H12V16M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z",
      exito: "M20 6L9 17L4 12",
      alerta: "M12 9V13M12 17H12.01M10.3 3.9L1.8 18A2 2 0 0 0 3.5 21H20.5A2 2 0 0 0 22.2 18L13.7 3.9A2 2 0 0 0 10.3 3.9Z",
      error: "M15 9L9 15M9 9L15 15M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"
    }, m = y(() => T[$.tipo] || T.info);
    function v() {
      o.value || (o.value = !0, c.push(setTimeout(() => {
        b.value = !1, a("cerrada");
      }, 300)));
    }
    function _() {
      a("accion");
    }
    return R(() => d($.duracion)), G(i), w(() => $.mostrar, () => {
      i(), b.value = !0, o.value = !1, d($.duracion);
    }), (C, A) => b.value ? (l(), n("div", {
      key: 0,
      class: I(["chuspita", [`chuspita--${t.tipo}`, { "chuspita--saliendo": o.value }]]),
      style: N(t.duracion > 0 ? { "--chuspita-duracion": `${t.duracion}ms` } : null),
      role: "alert",
      onMouseenter: E,
      onMouseleave: r
    }, [
      e("span", _e, [
        (l(), n("svg", ye, [
          e("path", { d: m.value }, null, 8, xe)
        ]))
      ]),
      e("div", $e, [
        e("p", be, p(t.titulo), 1),
        t.mensaje ? (l(), n("p", ke, p(t.mensaje), 1)) : L("", !0),
        t.accion ? (l(), n("button", {
          key: 1,
          class: "chuspita__accion",
          onClick: _
        }, p(t.accion), 1)) : L("", !0)
      ]),
      t.cerrable ? (l(), n("button", {
        key: 0,
        class: "chuspita__cerrar",
        "aria-label": "Cerrar",
        onClick: v
      }, "✕")) : L("", !0),
      A[0] || (A[0] = e("span", {
        class: "chuspita__pompon chuspita__pompon--sup",
        "aria-hidden": "true"
      }, null, -1)),
      A[1] || (A[1] = e("span", {
        class: "chuspita__pompon chuspita__pompon--inf",
        "aria-hidden": "true"
      }, null, -1)),
      A[2] || (A[2] = e("span", {
        class: "chuspita__pompon chuspita__pompon--der",
        "aria-hidden": "true"
      }, null, -1)),
      t.duracion > 0 ? (l(), n("span", Se)) : L("", !0)
    ], 38)) : L("", !0);
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
  setup(t, { expose: x, emit: $ }) {
    const a = t, b = $, o = M(!1);
    let c = null;
    const s = /* @__PURE__ */ new Date(), g = y(
      () => a.fecha ?? `${String(s.getDate()).padStart(2, "0")}/${String(s.getMonth() + 1).padStart(2, "0")}/${s.getFullYear()}`
    ), i = y(
      () => a.hora ?? `${String(s.getHours()).padStart(2, "0")}:${String(s.getMinutes()).padStart(2, "0")}`
    );
    function d() {
      clearTimeout(c), o.value = !1, requestAnimationFrame(() => {
        o.value = !0, b("sellado"), c = setTimeout(() => o.value = !1, 800);
      });
    }
    return x({ sellar: d }), R(d), w(() => a.estampar, d), (E, r) => (l(), n("div", {
      class: I(["cargo", { "cargo--estampando": o.value }]),
      style: N({ "--cargo-color": t.color, "--cargo-size": `${t.tamano}px` }),
      role: "img",
      "aria-label": `Recibido con cargo: trámite ${t.numeroTramite}`,
      onClick: d
    }, [
      e("div", Ae, [
        r[5] || (r[5] = e("div", { class: "cargo__titulo" }, "Recibido con cargo", -1)),
        e("div", Te, [
          r[0] || (r[0] = e("span", { class: "cargo__etiqueta" }, "Trámite", -1)),
          e("span", Ce, p(t.numeroTramite), 1)
        ]),
        e("div", Ee, [
          r[1] || (r[1] = e("span", { class: "cargo__etiqueta" }, "Fecha", -1)),
          e("span", we, p(g.value), 1)
        ]),
        e("div", Ne, [
          r[2] || (r[2] = e("span", { class: "cargo__etiqueta" }, "Hora", -1)),
          e("span", Fe, p(i.value), 1)
        ]),
        e("div", Le, [
          r[3] || (r[3] = e("span", { class: "cargo__etiqueta" }, "Recibió", -1)),
          e("span", Re, p(t.receptor), 1)
        ]),
        e("div", ze, [
          r[4] || (r[4] = e("span", { class: "cargo__etiqueta" }, "Entidad", -1)),
          e("span", Ie, p(t.institucion), 1)
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
  setup(t, { expose: x, emit: $ }) {
    const a = t, b = $, o = M(!1);
    let c = null;
    const s = y(() => `Pág. ${a.pagina || 1} de ${a.total}`);
    function g() {
      clearTimeout(c), o.value = !1, requestAnimationFrame(() => {
        o.value = !0, b("sellado"), c = setTimeout(() => o.value = !1, 700);
      });
    }
    return x({ sellar: g }), R(g), w(() => a.estampar, g), w(() => a.pagina, g), (i, d) => (l(), n("div", {
      class: I(["folio", { "folio--estampando": o.value }]),
      style: N({ "--folio-color": t.color, "--folio-size": `${t.tamano}px` }),
      role: "img",
      "aria-label": s.value,
      onClick: g
    }, [
      e("div", qe, p(t.documento), 1),
      e("div", Be, [
        e("span", De, p(s.value), 1),
        d[0] || (d[0] = e("span", null, "Folio legalizado", -1))
      ])
    ], 14, je));
  }
}, z = (t, x = 24) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} ${x}">${t}</svg>`
)}`, Ge = [
  {
    nombre: "Estrella",
    imagen: z(
      '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="#000"/>'
    )
  },
  {
    nombre: "Check",
    imagen: z('<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>')
  },
  {
    nombre: "Corazón",
    imagen: z(
      '<path d="M12 21s-8.4-5.4-10.3-10C.4 7.6 2.6 4 6.2 4c2.3 0 4 1.3 5.8 3.4C13.8 5.3 15.5 4 17.8 4c3.6 0 5.8 3.6 4.5 7-1.9 4.6-10.3 10-10.3 10z" fill="#000"/>'
    )
  },
  {
    nombre: "Rayo",
    imagen: z('<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#000"/>')
  },
  {
    nombre: "Avión",
    imagen: z(
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
