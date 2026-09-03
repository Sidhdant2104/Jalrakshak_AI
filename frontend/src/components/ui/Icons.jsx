export function Icon({ name, size = 16 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>,
    live: <><path d="M4 12h3l2-6 4 12 2-6h5" /></>,
    network: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h8M6 8v8M18 8v8M8 18h8" /></>,
    quality: <><path d="M12 3c4 4 6 7 6 10a6 6 0 1 1-12 0c0-3 2-6 6-10z" /></>,
    treatment: <><path d="M4 20h16M7 20V8l5-4 5 4v12" /><path d="M9 12h6M9 16h6" /></>,
    analysis: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" /></>,
    alerts: <><path d="M12 3 3 19h18L12 3z" /><path d="M12 9v5M12 16h.01" /></>,
    analytics: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    citizen: <><circle cx="12" cy="8" r="3" /><path d="M5 20c1.5-3 4-5 7-5s5.5 2 7 5" /></>,
    operations: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.7 1 1.2 1.7 1.3H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    reports: <><path d="M7 3h8l5 5v13H7z" /><path d="M15 3v5h5M9 13h6M9 17h6" /></>,
    sensors: <><path d="M5 12a7 7 0 0 1 14 0" /><path d="M8 12a4 4 0 0 1 8 0" /><circle cx="12" cy="12" r="1.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
}
