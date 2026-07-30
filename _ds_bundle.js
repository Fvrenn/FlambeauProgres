/* @ds-bundle: {"format":4,"namespace":"FlambeauProgrSDesignSystem_0e4b04","components":[{"name":"BadgeSelector","sourcePath":"components/badges/BadgeSelector.jsx"},{"name":"TrainingCard","sourcePath":"components/cards/TrainingCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusPill","sourcePath":"components/feedback/StatusPill.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"CompetencyItem","sourcePath":"components/lists/CompetencyItem.jsx"},{"name":"RoleMenu","sourcePath":"components/navigation/RoleMenu.jsx"},{"name":"SegmentedTabs","sourcePath":"components/navigation/SegmentedTabs.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"}],"sourceHashes":{"components/badges/BadgeSelector.jsx":"7076b77bf992","components/cards/TrainingCard.jsx":"ab719984a57b","components/core/Avatar.jsx":"f58d12485d73","components/core/Button.jsx":"983c255fcb4b","components/core/IconButton.jsx":"9b3b50020355","components/feedback/ProgressBar.jsx":"25b40a53a9b2","components/feedback/StatusPill.jsx":"ce8d6383d443","components/feedback/Tag.jsx":"4afa6f18bfa7","components/lists/CompetencyItem.jsx":"785172143082","components/navigation/RoleMenu.jsx":"2db7613c1c1c","components/navigation/SegmentedTabs.jsx":"11ae11b94df4","components/navigation/SidebarNav.jsx":"eb0cc89e5535","ui_kits/app/ProgressionScreen.jsx":"4af752497efa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FlambeauProgrSDesignSystem_0e4b04 = window.FlambeauProgrSDesignSystem_0e4b04 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/badges/BadgeSelector.jsx
try { (() => {
const HEX = "M35.175 0 L70.35 20.212 L70.35 60.638 L35.175 80.85 L0 60.638 L0 20.212 Z";
function BadgeSelector({
  image,
  selected = false,
  onClick,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": label,
    "aria-pressed": selected,
    style: {
      width: 70.35,
      height: 80.85,
      border: "none",
      cursor: "pointer",
      background: "transparent",
      padding: 0,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 70.35 80.85",
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("clipPath", {
    id: "hex-" + label
  }, /*#__PURE__*/React.createElement("path", {
    d: HEX
  })), /*#__PURE__*/React.createElement("image", {
    href: image,
    width: "70.35",
    height: "80.85",
    preserveAspectRatio: "xMidYMid slice",
    clipPath: `url(#hex-${label})`
  }), /*#__PURE__*/React.createElement("path", {
    d: HEX,
    fill: "none",
    stroke: selected ? "var(--color-gold-400)" : "transparent",
    strokeWidth: "3"
  })));
}
Object.assign(__ds_scope, { BadgeSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/BadgeSelector.jsx", error: String((e && e.message) || e) }); }

// components/cards/TrainingCard.jsx
try { (() => {
function TrainingCard({
  image,
  category,
  title,
  description,
  duration,
  href = "#",
  external = true
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    target: external ? "_blank" : undefined,
    rel: external ? "noreferrer" : undefined,
    style: {
      display: "flex",
      flexDirection: "column",
      width: 280,
      textDecoration: "none",
      color: "inherit",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      overflow: "hidden",
      boxShadow: "var(--shadow-inset-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 150,
      background: "var(--surface-sunken)",
      overflow: "hidden"
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      flex: 1
    }
  }, category && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      fontWeight: "var(--weight-label-semibold)",
      color: "var(--text-brand)",
      textTransform: "uppercase",
      letterSpacing: .4
    }
  }, category), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-h2)",
      lineHeight: "var(--leading-h2)",
      fontWeight: "var(--weight-h2)",
      color: "var(--text-primary)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-label)",
      lineHeight: "var(--leading-label)",
      color: "var(--text-muted)",
      flex: 1
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8
    }
  }, duration && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      color: "var(--text-muted)"
    }
  }, duration), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-label)",
      color: "var(--text-primary)"
    }
  }, "\u2197"))));
}
Object.assign(__ds_scope, { TrainingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TrainingCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
const SIZES = {
  sm: 28,
  md: 40,
  lg: 56
};
function Avatar({
  src,
  initials,
  size = "md",
  ring = false
}) {
  const s = SIZES[size] ?? SIZES.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: s,
      height: s,
      borderRadius: "var(--radius-full)",
      flexShrink: 0,
      background: src ? "transparent" : "var(--surface-inverse)",
      color: "var(--text-on-inverse)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-sans)",
      fontSize: s * 0.38,
      fontWeight: "var(--weight-label-semibold)",
      overflow: "hidden",
      boxShadow: ring ? "0 0 0 2px var(--color-gold-400)" : "none"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 32,
    padX: 14,
    fontSize: "var(--text-caption)",
    lineHeight: "var(--leading-caption)",
    gap: 6
  },
  md: {
    h: 40,
    padX: 18,
    fontSize: "var(--text-label)",
    lineHeight: "var(--leading-label)",
    gap: 8
  },
  lg: {
    h: 48,
    padX: 24,
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    gap: 10
  }
};
const VARIANTS = {
  primary: {
    bg: "var(--surface-inverse)",
    fg: "var(--text-on-inverse)",
    border: "none"
  },
  secondary: {
    bg: "var(--surface-muted)",
    fg: "var(--text-primary)",
    border: "none"
  },
  outline: {
    bg: "transparent",
    fg: "var(--text-primary)",
    border: "1px solid var(--border-default)"
  },
  ghost: {
    bg: "transparent",
    fg: "var(--text-primary)",
    border: "none"
  },
  accent: {
    bg: "var(--surface-highlight)",
    fg: "var(--text-primary)",
    border: "none"
  }
};
function Button({
  children,
  icon,
  trailingIcon,
  kbd,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick
}) {
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    style: {
      height: s.h,
      padding: `0 ${s.padX}px`,
      display: "inline-flex",
      alignItems: "center",
      gap: s.gap,
      borderRadius: "var(--radius-full)",
      background: v.bg,
      color: v.fg,
      border: v.border,
      fontFamily: "var(--font-sans)",
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      fontWeight: "var(--weight-label-medium)",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? .45 : 1,
      whiteSpace: "nowrap",
      transition: "background var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard)"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      display: "flex",
      width: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center"
    }
  }, icon), children, trailingIcon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      display: "flex",
      width: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center"
    }
  }, trailingIcon), kbd && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      marginLeft: 2,
      fontSize: 11,
      lineHeight: "16px",
      padding: "0 6px",
      borderRadius: "var(--radius-full)",
      background: "rgba(255,255,255,.18)",
      color: "inherit"
    }
  }, kbd));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  children,
  active = false,
  size = 40,
  onClick,
  "aria-label": ariaLabel
}) {
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": ariaLabel,
    onClick: onClick,
    style: {
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-sm)",
      border: "none",
      cursor: "pointer",
      background: active ? "var(--surface-inverse)" : "var(--surface-muted)",
      color: active ? "var(--text-on-inverse)" : "var(--text-primary)",
      transition: "background var(--duration-fast) var(--ease-standard)"
    }
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "100%"
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", null, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 8,
      borderRadius: "var(--radius-full)",
      background: "var(--surface-muted)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      borderRadius: "var(--radius-full)",
      background: "var(--color-gold-400)",
      transition: "width var(--duration-base) var(--ease-standard)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusPill.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: "rgba(232,231,222,.4)",
    fg: "var(--text-accent-violet)"
  },
  done: {
    bg: "var(--surface-highlight)",
    fg: "var(--text-primary)"
  }
};
function StatusPill({
  children = "Non fait",
  tone = "neutral"
}) {
  const t = TONES[tone] ?? TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 24,
      padding: "0 10px",
      borderRadius: "var(--radius-full)",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      whiteSpace: "nowrap"
    }
  }, children);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: "var(--surface-muted)",
    fg: "var(--text-primary)"
  },
  brand: {
    bg: "var(--color-orange-600)",
    fg: "#fff"
  },
  gold: {
    bg: "var(--color-gold-400)",
    fg: "var(--text-primary)"
  },
  violet: {
    bg: "var(--color-violet-500)",
    fg: "#fff"
  }
};
function Tag({
  children,
  tone = "neutral"
}) {
  const t = TONES[tone] ?? TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 10px",
      borderRadius: "var(--radius-full)",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      fontWeight: "var(--weight-label-medium)",
      whiteSpace: "nowrap"
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/lists/CompetencyItem.jsx
try { (() => {
function CompetencyItem({
  code = "B1",
  text,
  status = "Non fait",
  tone = "neutral",
  last = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      padding: "26px 20px",
      display: "flex",
      alignItems: "center",
      gap: 30,
      borderBottom: last ? "none" : "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-full)",
      boxShadow: "inset 0 0 0 1px #E9E9E9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 20,
      color: "var(--text-primary)"
    }
  }, code), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-lg)",
      lineHeight: "var(--leading-body-lg)",
      color: "var(--text-primary)"
    }
  }, text), /*#__PURE__*/React.createElement(__ds_scope.StatusPill, {
    tone: tone
  }, status), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    "aria-label": "Ouvrir la comp\xE9tence"
  }, "\u203A"));
}
Object.assign(__ds_scope, { CompetencyItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/lists/CompetencyItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/RoleMenu.jsx
try { (() => {
function RoleMenu({
  role = "Admin",
  context = "Mon Progrès (Chef)"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 239,
      height: 54,
      borderRadius: "var(--radius-sm)",
      position: "relative",
      background: "var(--surface-muted)",
      boxShadow: "var(--shadow-inset-border)",
      padding: "9px 12px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-label)",
      lineHeight: "var(--leading-label)",
      fontWeight: "var(--weight-label-medium)",
      color: "var(--text-primary)"
    }
  }, role), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption)",
      lineHeight: "var(--leading-caption)",
      color: "var(--text-muted)"
    }
  }, context), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      background: "#A1A1AA",
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      background: "#A1A1AA",
      borderRadius: 1
    }
  })));
}
Object.assign(__ds_scope, { RoleMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/RoleMenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SegmentedTabs.jsx
try { (() => {
const {
  useState
} = React;
function SegmentedTabs({
  tabs,
  defaultIndex = 0,
  variant = "inverse"
}) {
  const [active, setActive] = useState(defaultIndex);
  const inverse = variant === "inverse";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 0,
      padding: 2,
      borderRadius: "var(--radius-full)",
      background: inverse ? "var(--surface-inverse)" : "var(--surface-page)",
      borderBottom: inverse ? "1px solid rgba(17,17,17,.15)" : "none"
    }
  }, tabs.map((t, i) => {
    const isActive = i === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => setActive(i),
      style: {
        border: "none",
        cursor: "pointer",
        borderRadius: "var(--radius-full)",
        padding: "14px 24px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-label)",
        lineHeight: "var(--leading-label)",
        fontWeight: isActive ? "var(--weight-label-semibold)" : "var(--weight-label-regular)",
        background: isActive ? inverse ? "var(--surface-card)" : "var(--surface-highlight)" : "transparent",
        boxShadow: isActive ? "var(--shadow-pill)" : "none",
        color: isActive ? "var(--text-primary)" : inverse ? "var(--text-on-inverse)" : "var(--text-primary)",
        transition: "background var(--duration-fast) var(--ease-standard)"
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { SegmentedTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SegmentedTabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
const {
  useState
} = React;
function SidebarNav({
  items,
  defaultIndex = 1
}) {
  const [active, setActive] = useState(defaultIndex);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: 239
    }
  }, items.map((item, i) => {
    const isActive = i === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      onClick: () => setActive(i),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        textAlign: "left",
        border: "none",
        cursor: "pointer",
        width: "100%",
        height: 44,
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        background: isActive ? "var(--surface-muted)" : "transparent",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-label)",
        lineHeight: "var(--leading-label)",
        fontWeight: "var(--weight-label-medium)",
        color: "var(--text-primary)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, item.icon), item.label);
  }));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ProgressionScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const BADGES = Array.from({
  length: 12
}, (_, i) => `../../assets/badges/badge-${String(i + 1).padStart(2, "0")}.png`);
const COMPETENCIES = [{
  code: "B1",
  text: "Acquérir et savoir utiliser le \"Guide du Bois\" (p. 9 à 11)",
  status: "Non fait"
}, {
  code: "B2",
  text: "Se repérer dans le carnet et savoir expliquer l'ordre et le principe des différentes parties de chaque volume.",
  status: "Non fait"
}, {
  code: "B3",
  text: "Lire le chapitre \"L'enfant à l'âge PF\" p.19 du Guide du Bois et animer une discussion.",
  status: "Non fait"
}, {
  code: "B4",
  text: "Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser.",
  status: "Validé",
  tone: "done"
}, {
  code: "B5",
  text: "Connaître les grandes lignes de l'histoire des ABQS, le rôle des 5 personnages principaux.",
  status: "Non fait"
}, {
  code: "B6",
  text: "Expliquer aux jeunes le sens des différents rituels (rassemblement, Grand Arbre...) et connaître la place des différents marqueurs sur l'uniforme.",
  status: "Non fait"
}, {
  code: "B7",
  text: "Accompagner un ami du Bois dans toute la démarche de la Parole de PF.",
  status: "Non fait"
}];
function ProgressionScreen() {
  const {
    SidebarNav,
    RoleMenu,
    SegmentedTabs,
    BadgeSelector,
    CompetencyItem
  } = window.FlambeauProgrSDesignSystem_0e4b04;
  const [selectedBadge, setSelectedBadge] = useState(0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1920,
      minHeight: 859,
      background: "var(--surface-page)",
      display: "flex",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 288,
      borderRight: "1px solid var(--border-default)",
      padding: "24px 24px 0",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-flambeau-progres.svg",
    style: {
      width: 50,
      height: 68
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      marginTop: -59,
      marginLeft: 66,
      fontWeight: 500,
      fontSize: 24,
      lineHeight: "28px",
      color: "var(--text-brand)",
      whiteSpace: "pre"
    }
  }, "Flambeau\nProgrès"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(RoleMenu, {
    role: "Admin",
    context: "Mon Progr\xE8s (Chef)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    items: [{
      label: "Tableau de bord"
    }, {
      label: "Progression"
    }, {
      label: "Formation"
    }],
    defaultIndex: 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "16px 24px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 20px",
      fontWeight: 400,
      fontSize: 30,
      lineHeight: "36px",
      color: "var(--text-primary)"
    }
  }, "Tableau de bord"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 345,
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-sunken)",
      padding: 2,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/badges/hero-scouts.png",
    style: {
      width: 341,
      height: "auto",
      display: "block",
      borderRadius: "22px 22px 0 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-muted)",
      boxShadow: "var(--shadow-inset-border)",
      borderRadius: "0 0 22px 22px",
      padding: 29,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 12,
      justifyItems: "center"
    }
  }, BADGES.map((b, i) => /*#__PURE__*/React.createElement(BadgeSelector, {
    key: i,
    image: b,
    label: String(i),
    selected: i === selectedBadge,
    onClick: () => setSelectedBadge(i)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SegmentedTabs, {
    tabs: ["Objectif", "Notifications"],
    variant: "inverse"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontWeight: 700,
      fontSize: 20,
      lineHeight: "28px"
    }
  }, "\xC9tape Branche Petits Flambeaux"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/badges/badge-01.png",
    style: {
      width: 24
    }
  })), /*#__PURE__*/React.createElement(SegmentedTabs, {
    tabs: ["Compétences", "Réalisations"],
    variant: "light"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      borderTop: "1px solid var(--border-default)"
    }
  }, COMPETENCIES.map((c, i) => /*#__PURE__*/React.createElement(CompetencyItem, _extends({
    key: c.code
  }, c, {
    last: i === COMPETENCIES.length - 1
  })))))))));
}
window.ProgressionScreen = ProgressionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ProgressionScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BadgeSelector = __ds_scope.BadgeSelector;

__ds_ns.TrainingCard = __ds_scope.TrainingCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.CompetencyItem = __ds_scope.CompetencyItem;

__ds_ns.RoleMenu = __ds_scope.RoleMenu;

__ds_ns.SegmentedTabs = __ds_scope.SegmentedTabs;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

})();
