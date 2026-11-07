import type { IslandState } from "../island/machine";
import type { AssetId, Platform } from "./download";

/**
 * Textos de la web en castellano e inglés. El idioma sale de `?lang=`, de lo que eligió el
 * visitante la otra vez o del idioma del navegador (castellano y catalán → castellano; el
 * resto → inglés).
 */

export type Lang = "es" | "en";
export type DesktopOs = "windows" | "mac" | "linux";

export interface Copy {
  lang: Lang;
  /** Para fechas y números (`toLocaleString`). */
  locale: string;
  skip: string;
  nav: { aria: string; island: string; phrases: string; ticos: string; film: string; download: string };
  music: { aria: string; title: string; on: string; off: string };
  langSwitch: { aria: string; label: string };
  pet: { aria: string; caption: string; hint: string };
  hero: {
    tryTouch: string;
    tryMouse: string;
    keys: [string, string, string];
    title: string;
    lead: string;
    downloadFor: (system: string) => string;
    downloadComputer: string;
    allSystems: string;
    github: string;
    meta: (version: string) => string;
    allDownloads: string;
  };
  platforms: Record<Platform, string>;
  states: {
    title: string;
    lead: string;
    aria: string;
    edge: string;
    scale: string;
    items: Record<IslandState, { name: string; how: string }>;
  };
  phrases: {
    title: string;
    lead: string;
    quote: (text: string) => string;
    items: { say: string; does: string; tag: string }[];
  };
  cast: {
    title: string;
    lead: string;
    names: Record<string, string>;
    lines: Record<string, string>;
    react: (name: string) => string;
    note: string;
  };
  film: { title: string; lead: string; play: string; fallback: string };
  doesnt: { title: string; items: string[]; note: string };
  downloads: {
    title: (version: string) => string;
    lead: string;
    yours: string;
    get: string;
    firstTime: string;
    firstRun: Record<DesktopOs, string>;
    notes: string;
    assets: Record<AssetId, { label: string; note: string }>;
    support: string;
    supportButton: string;
  };
  questions: { title: string; items: { q: string; a: string }[] };
  footer: {
    madeBy: string;
    legal: string;
    aria: string;
    releases: string;
    issues: string;
    support: string;
    openIsland: string;
  };
  island: {
    compact: string;
    thinking: string;
    answering: string;
    idle: string;
    hello: string;
    aria: string;
    close: string;
    downloading: (file: string) => string;
    firstRun: Record<"exe" | "dmg" | "appimage" | "deb", string>;
  };
}

const es: Copy = {
  lang: "es",
  locale: "es-ES",
  skip: "Saltar al contenido",
  nav: {
    aria: "Secciones",
    island: "La isla",
    phrases: "Qué hace",
    ticos: "Los Ticos",
    film: "Anuncio",
    download: "Descargar",
  },
  music: { aria: "Música de fondo", title: "Música de fondo compuesta para Tico", on: "Música", off: "Poner música" },
  langSwitch: { aria: "Read this page in English", label: "EN" },
  pet: {
    aria: "Tico: haz clic para que salude, o arrástralo",
    caption: "Tico en el escritorio",
    hint: "arrástralo · clic para saludar",
  },
  hero: {
    tryTouch: "Toca la cápsula negra de arriba: es Tico.",
    tryMouse: "Pruébalo aquí: lleva el ratón al borde de arriba de esta página o pulsa",
    keys: ["Ctrl", "Mayús", "Espacio"],
    title: "Un asistente que vive arriba de tu pantalla.",
    lead: "Tico es una isla para Windows, macOS y Linux. Llevas el ratón arriba, baja una cápsula negra con un robot dentro y le pides lo que necesites: que mire tu pantalla, que pase un Word a PDF o que cambie de canción. Cuando no lo usas, no ocupa nada.",
    downloadFor: (system) => `Descargar para ${system}`,
    downloadComputer: "Descargar para ordenador",
    allSystems: "Windows, macOS y Linux",
    github: "Código en GitHub",
    meta: (version) => `Versión ${version} · gratis · código abierto (MIT) · sin cuenta ·`,
    allDownloads: "todas las descargas",
  },
  platforms: { windows: "Windows", mac: "macOS", linux: "Linux", mobile: "móvil", unknown: "tu sistema" },
  states: {
    title: "Cuatro tamaños, según lo cerca que estés.",
    lead: "La isla está pensada para no molestar. Mientras trabajas no la ves; cuando la buscas, aparece donde ya estás mirando. Fuera de la cápsula, los clics pasan a la app de debajo.",
    aria: "Los cuatro estados de la isla dibujados a escala",
    edge: "borde superior de la pantalla",
    scale: "escala 1:2 · px",
    items: {
      hidden: { name: "Oculta", how: "No ocupa nada. Tus clics pasan a lo que hay debajo." },
      peek: { name: "Asoma", how: "Ratón 150 ms en los 3 px de arriba." },
      compact: { name: "Crece", how: "Pasas el ratón por encima." },
      expanded: { name: "Abierta", how: "Un clic, o Ctrl + Mayús + Espacio desde cualquier app." },
    },
  },
  phrases: {
    title: "Le hablas como a una persona.",
    lead: "Algunas cosas que le puedes pedir, y lo que hace con cada una.",
    quote: (text) => `«${text}»`,
    items: [
      {
        say: "¿Qué ves en mi pantalla?",
        does: "Hace una captura solo en ese momento, lee hasta la letra pequeña con el OCR del sistema y te contesta. Con tu banco o tu gestor de contraseñas a la vista, no captura.",
        tag: "solo si se lo pides",
      },
      {
        say: "Pásame este Word a PDF",
        does: "Lo convierte con Word, Pages o LibreOffice. Si no tienes ninguno, usa su propio motor. El PDF aparece en Descargas.",
        tag: "sin gastar IA",
      },
      {
        say: "Envíaselo a ana@…",
        does: "Sueltas un archivo en la isla y se abre una ventanita con Para, Asunto y Mensaje, con el adjunto ya puesto. Sale desde tu cuenta de correo.",
        tag: "Gmail, iCloud, Outlook…",
      },
      {
        say: "Pausa. Siguiente canción.",
        does: "Controla lo que suena en Spotify, Apple Music o YouTube, con la portada en la isla, y sube o baja el volumen. Tico baila mientras tanto.",
        tag: "sin gastar IA",
      },
      {
        say: "Recuerda que estudio Derecho",
        does: "Lo apunta y lo tiene en cuenta en todas las conversaciones. «¿Qué recuerdas de mí?» te enseña la lista y «olvida que…» la corrige.",
        tag: "se guarda en tu ordenador",
      },
      {
        say: "/traducir",
        does: "Escribe una barra y salen los comandos: traducir, mejorar un texto, explicar, resumir un archivo, cambiar de Tico o de espacio de trabajo.",
        tag: "paleta de comandos",
      },
      {
        say: "Usa Gemini para esto",
        does: "Funciona con Claude, ChatGPT, Gemini, Groq, Mistral, DeepSeek, Grok u OpenRouter, o gratis en tu ordenador con Ollama y LM Studio. Cambias de IA desde el chat.",
        tag: "12 servicios",
      },
    ],
  },
  cast: {
    title: "Un Tico para cada cosa.",
    lead: "Vienen cinco de serie y puedes crear hasta doce, cada uno con su ropa, sus colores, su forma de responder y, si quieres, su propia IA. Los agrupas en espacios de trabajo, y si abres la isla con Visual Studio Code delante, aparece el de programar.",
    names: {},
    lines: {
      tico: "Para todo. El de siempre.",
      code: "Código que funciona, con el porqué.",
      translate: "Al castellano o al inglés, sin rodeos.",
      write: "Corrige y mejora tus textos.",
      teach: "Te lo explica paso a paso.",
    },
    react: (name) => `${name}: haz clic para que reaccione`,
    note: "Haz clic en cualquiera: tienen 15 expresiones.",
  },
  film: {
    title: "El anuncio.",
    lead: "35 segundos, con sonido. Hecho con los mismos componentes que la app.",
    play: "Reproducir · 0:35",
    fallback: "Tu navegador no puede reproducir el vídeo.",
  },
  doesnt: {
    title: "Lo que Tico no hace.",
    items: [
      "No tiene servidores ni te pide una cuenta.",
      "No envía estadísticas de uso a nadie.",
      "No mira tu pantalla si no se lo pides.",
      "No guarda las capturas en el disco.",
      "No deja tus claves en archivos: van al llavero del sistema.",
    ],
    note: "Las conversaciones, los ajustes y lo que le pides que recuerde van en una base de datos en tu ordenador. Solo sale lo que mandas a la IA que elijas. El código es abierto y los instaladores se compilan a la vista en GitHub.",
  },
  downloads: {
    title: (version) => `Descargar Tico ${version}.`,
    lead: "Gratis y sin cuenta. Los enlaces bajan siempre la última versión publicada.",
    yours: "tu equipo",
    get: "Descargar",
    firstTime: "La primera vez:",
    firstRun: {
      windows: "Si sale «Windows protegió su PC», pulsa Más información → Ejecutar de todas formas.",
      mac: "Si dice que no puede verificarlo: Ajustes del Sistema → Privacidad y seguridad → Abrir igualmente.",
      linux: "AppImage: Propiedades → Permitir ejecutar. Paquete: sudo apt install ./Tico-Linux-amd64.deb",
    },
    notes: "Notas de la versión en GitHub",
    assets: {
      winX64: { label: "Instalador", note: "Windows 10 y 11 de 64 bits (Intel o AMD)" },
      winX86: { label: "Instalador 32 bits", note: "Windows de 32 bits y Windows 10 ARM" },
      winX64Zip: { label: "Portable", note: "Sin instalar · 64 bits" },
      winX86Zip: { label: "Portable 32 bits", note: "Sin instalar · 32 bits y ARM" },
      mac: { label: "Imagen de disco", note: "macOS 11 o posterior · Apple Silicon e Intel" },
      appImage: { label: "AppImage", note: "Sin instalar · Fedora 40+, Arch y otras" },
      deb: { label: "Paquete .deb", note: "Ubuntu 24.04+, Debian 13, Linux Mint 22" },
    },
    support: "Tico es gratis y sin anuncios. Si te ayuda en tu día a día, puedes invitar a un café a quien lo hace.",
    supportButton: "Invitar a un café",
  },
  questions: {
    title: "Preguntas.",
    items: [
      {
        q: "¿Cuánto cuesta?",
        a: "Nada. Solo pagarías la IA si eliges un servicio de pago. Con el modo demo, Groq, la capa gratuita de Gemini, Ollama o LM Studio no pagas nada.",
      },
      {
        q: "¿Necesito una clave de IA?",
        a: "Para probarlo, no: trae un modo demo. Para usarlo de verdad, la bienvenida te ayuda en un minuto a elegir una IA y pegar su clave.",
      },
      {
        q: "¿Mira mi pantalla todo el rato?",
        a: "No. Solo cuando se lo pides con el botón, el atajo o una pregunta como «¿qué ves?». La imagen no se guarda en el disco.",
      },
      {
        q: "¿Funciona en mi ordenador?",
        a: "En Windows 10 y 11 (64 bits, 32 bits y ARM), en macOS 11 o posterior (Apple Silicon e Intel) y en Linux reciente: Ubuntu 24.04, Debian 13, Fedora 40 y similares.",
      },
    ],
  },
  footer: {
    madeBy: "Hecho por Victor",
    legal: "El código tiene licencia MIT. Tico, su nombre, su diseño y sus sonidos son de Victor, con todos los derechos reservados. La música de fondo es original, compuesta para Tico. Esta web no usa cookies ni analítica.",
    aria: "Enlaces",
    releases: "Versiones",
    issues: "Avisar de un fallo",
    support: "Invítame a un café",
    openIsland: "Abrir la isla",
  },
  island: {
    compact: "Haz clic para hablar conmigo",
    thinking: "Pensando…",
    answering: "Respondiendo…",
    idle: "Demo · elige una pregunta",
    hello: "Hola. En la app me escribes lo que quieras; aquí, elige una:",
    aria: "Demo de Tico",
    close: "Cerrar aviso",
    downloading: (file) => `Descargando ${file}`,
    firstRun: {
      dmg: "Arrastra Tico a Aplicaciones. Si macOS no lo abre: Ajustes del Sistema → Privacidad y seguridad → Abrir igualmente.",
      appimage: "Dale permiso para ejecutarse (Propiedades → Permitir ejecutar) y ábrelo con doble clic.",
      deb: "Ábrelo con el Centro de software o en la terminal: sudo apt install ./Tico-Linux-amd64.deb",
      exe: "Si sale «Windows protegió su PC», pulsa Más información → Ejecutar de todas formas.",
    },
  },
};

const en: Copy = {
  lang: "en",
  locale: "en-GB",
  skip: "Skip to content",
  nav: {
    aria: "Sections",
    island: "The island",
    phrases: "What it does",
    ticos: "The Ticos",
    film: "Film",
    download: "Download",
  },
  music: { aria: "Background music", title: "Background music made for Tico", on: "Music", off: "Play music" },
  langSwitch: { aria: "Leer esta página en castellano", label: "ES" },
  pet: {
    aria: "Tico: click to make him wave, or drag him around",
    caption: "Tico on your desktop",
    hint: "drag him · click to say hi",
  },
  hero: {
    tryTouch: "Tap the black capsule at the top: that's Tico.",
    tryMouse: "Try it here: move your mouse to the top edge of this page or press",
    keys: ["Ctrl", "Shift", "Space"],
    title: "An assistant that lives at the top of your screen.",
    lead: "Tico is an island for Windows, macOS and Linux. Move your mouse to the top, a black capsule drops down with a little robot inside, and you ask for what you need: look at your screen, turn a Word file into a PDF, skip a song. When you're not using it, it takes up no space.",
    downloadFor: (system) => `Download for ${system}`,
    downloadComputer: "Download for your computer",
    allSystems: "Windows, macOS and Linux",
    github: "Code on GitHub",
    meta: (version) => `Version ${version} · free · open source (MIT) · no account ·`,
    allDownloads: "all downloads",
  },
  platforms: { windows: "Windows", mac: "macOS", linux: "Linux", mobile: "phone", unknown: "your system" },
  states: {
    title: "Four sizes, depending on how close you are.",
    lead: "The island is built to stay out of the way. While you work you don't see it; when you look for it, it shows up where you're already looking. Outside the capsule, clicks go through to the app underneath.",
    aria: "The four states of the island, drawn to scale",
    edge: "top edge of the screen",
    scale: "scale 1:2 · px",
    items: {
      hidden: { name: "Hidden", how: "Takes no space. Your clicks reach whatever is underneath." },
      peek: { name: "Peeks", how: "Mouse 150 ms on the top 3 px." },
      compact: { name: "Grows", how: "You hover over it." },
      expanded: { name: "Open", how: "One click, or Ctrl + Shift + Space from any app." },
    },
  },
  phrases: {
    title: "You talk to it like a person.",
    lead: "A few things you can ask for, and what it does with each one.",
    quote: (text) => `“${text}”`,
    items: [
      {
        say: "What do you see on my screen?",
        does: "It takes a screenshot only at that moment, reads even the small print with your system's OCR and answers. With your bank or your password manager on screen, it won't capture.",
        tag: "only when you ask",
      },
      {
        say: "Turn this Word file into a PDF",
        does: "It converts it with Word, Pages or LibreOffice. If you have none of them, it uses its own engine. The PDF lands in Downloads.",
        tag: "no AI needed",
      },
      {
        say: "Send it to ana@…",
        does: "Drop a file on the island and a small window opens with To, Subject and Message, with the attachment already in. It goes out from your own email account.",
        tag: "Gmail, iCloud, Outlook…",
      },
      {
        say: "Pause. Next song.",
        does: "It controls what's playing on Spotify, Apple Music or YouTube, shows the cover art in the island and turns the volume up or down. Tico dances along.",
        tag: "no AI needed",
      },
      {
        say: "Remember that I study law",
        does: "It notes it down and keeps it in mind in every conversation. “What do you remember about me?” shows the list and “forget that…” fixes it.",
        tag: "stays on your computer",
      },
      {
        say: "/translate",
        does: "Type a slash and the commands appear: translate, improve a text, explain, summarise a file, switch Tico or workspace.",
        tag: "command palette",
      },
      {
        say: "Use Gemini for this",
        does: "It works with Claude, ChatGPT, Gemini, Groq, Mistral, DeepSeek, Grok or OpenRouter, or for free on your own computer with Ollama and LM Studio. You switch AI from the chat.",
        tag: "12 services",
      },
    ],
  },
  cast: {
    title: "A Tico for every job.",
    lead: "Five come built in and you can create up to twelve, each with its own outfit, colours, way of answering and, if you like, its own AI. Group them into workspaces, and if you open the island with Visual Studio Code in front, the coding one shows up.",
    names: {
      tico: "Tico",
      code: "Tico Code",
      translate: "Tico Translator",
      write: "Tico Writer",
      teach: "Tico Teacher",
    },
    lines: {
      tico: "For everything. The original.",
      code: "Code that works, and why.",
      translate: "Into Spanish or English, straight up.",
      write: "Fixes and polishes your writing.",
      teach: "Explains it step by step.",
    },
    react: (name) => `${name}: click to see a reaction`,
    note: "Click any of them: they have 15 expressions.",
  },
  film: {
    title: "The film.",
    lead: "35 seconds, with sound (in Spanish). Made with the same components as the app.",
    play: "Play · 0:35",
    fallback: "Your browser can't play this video.",
  },
  doesnt: {
    title: "What Tico doesn't do.",
    items: [
      "It has no servers and never asks for an account.",
      "It doesn't send usage stats to anyone.",
      "It doesn't look at your screen unless you ask.",
      "It doesn't save screenshots to disk.",
      "It doesn't leave your keys in files: they go to your system keychain.",
    ],
    note: "Conversations, settings and what you ask it to remember live in a database on your computer. The only thing that leaves is what you send to the AI you choose. The code is open and the installers are built in the open on GitHub.",
  },
  downloads: {
    title: (version) => `Download Tico ${version}.`,
    lead: "Free, no account. The links always fetch the latest published version.",
    yours: "your computer",
    get: "Download",
    firstTime: "First time:",
    firstRun: {
      windows: "If you see “Windows protected your PC”, click More info → Run anyway.",
      mac: "If it says it can't be verified: System Settings → Privacy & Security → Open Anyway.",
      linux: "AppImage: Properties → Allow executing. Package: sudo apt install ./Tico-Linux-amd64.deb",
    },
    notes: "Release notes on GitHub",
    assets: {
      winX64: { label: "Installer", note: "Windows 10 and 11, 64-bit (Intel or AMD)" },
      winX86: { label: "32-bit installer", note: "32-bit Windows and Windows 10 on ARM" },
      winX64Zip: { label: "Portable", note: "No install · 64-bit" },
      winX86Zip: { label: "Portable 32-bit", note: "No install · 32-bit and ARM" },
      mac: { label: "Disk image", note: "macOS 11 or later · Apple Silicon and Intel" },
      appImage: { label: "AppImage", note: "No install · Fedora 40+, Arch and others" },
      deb: { label: ".deb package", note: "Ubuntu 24.04+, Debian 13, Linux Mint 22" },
    },
    support: "Tico is free and has no ads. If it helps you day to day, you can buy its maker a coffee.",
    supportButton: "Buy me a coffee",
  },
  questions: {
    title: "Questions.",
    items: [
      {
        q: "How much does it cost?",
        a: "Nothing. You'd only pay for the AI if you pick a paid service. With demo mode, Groq, Gemini's free tier, Ollama or LM Studio you pay nothing.",
      },
      {
        q: "Do I need an AI key?",
        a: "Not to try it: there's a demo mode. To use it for real, the welcome screen helps you pick an AI and paste its key in a minute.",
      },
      {
        q: "Is it watching my screen all the time?",
        a: "No. Only when you ask, with the button, the shortcut or a question like “what do you see?”. The image is never saved to disk.",
      },
      {
        q: "Will it run on my computer?",
        a: "On Windows 10 and 11 (64-bit, 32-bit and ARM), macOS 11 or later (Apple Silicon and Intel) and recent Linux: Ubuntu 24.04, Debian 13, Fedora 40 and similar.",
      },
    ],
  },
  footer: {
    madeBy: "Made by Victor",
    legal: "The code is MIT licensed. Tico, its name, design and sounds belong to Victor, all rights reserved. The background music is original, made for Tico. This site uses no cookies or analytics.",
    aria: "Links",
    releases: "Releases",
    issues: "Report a bug",
    support: "Buy me a coffee",
    openIsland: "Open the island",
  },
  island: {
    compact: "Click to talk to me",
    thinking: "Thinking…",
    answering: "Answering…",
    idle: "Demo · pick a question",
    hello: "Hi. In the app you can type anything; here, pick one:",
    aria: "Tico demo",
    close: "Close notice",
    downloading: (file) => `Downloading ${file}`,
    firstRun: {
      dmg: "Drag Tico to Applications. If macOS won't open it: System Settings → Privacy & Security → Open Anyway.",
      appimage: "Allow it to run (Properties → Allow executing) and double-click it.",
      deb: "Open it with your Software Center, or in a terminal: sudo apt install ./Tico-Linux-amd64.deb",
      exe: "If you see “Windows protected your PC”, click More info → Run anyway.",
    },
  },
};

export const COPY: Record<Lang, Copy> = { es, en };

/** Idioma del navegador → idioma de la web (castellano y catalán se quedan en castellano). */
export function langFromNavigator(languages: readonly string[]): Lang {
  for (const tag of languages) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "es" || base === "ca" || base === "gl" || base === "eu") return "es";
    if (base) return "en";
  }
  return "es";
}

/** `?lang=en` gana; luego lo que el visitante eligió otra vez; luego el navegador. */
export function pickLang(search: string, saved: string | null, languages: readonly string[]): Lang {
  const asked = new URLSearchParams(search).get("lang");
  if (asked === "es" || asked === "en") return asked;
  if (saved === "es" || saved === "en") return saved;
  return langFromNavigator(languages);
}

/** Tamaño de un archivo con la coma o el punto que toque. */
export function formatMb(mb: number, locale: string): string {
  return `${mb.toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: mb < 10 ? 1 : 0 })} MB`;
}

/** Tipo de archivo para el consejo de la primera vez. */
export function fileKind(file: string): keyof Copy["island"]["firstRun"] {
  if (file.endsWith(".dmg")) return "dmg";
  if (file.endsWith(".AppImage")) return "appimage";
  if (file.endsWith(".deb")) return "deb";
  return "exe";
}
