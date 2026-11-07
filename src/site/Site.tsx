import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { BASE_SIZES } from "../island/sizes";
import type { IslandState } from "../island/machine";
import type { Expression } from "../robot/expressions";
import { setGaze } from "../robot/gaze";
import { Tico } from "../robot/Tico";
import { DEFAULT_TICOS } from "../types";
import { fileKind, formatMb, type DesktopOs } from "./copy";
import {
  ASSETS,
  detectPlatform,
  downloadUrl,
  primaryAsset,
  readDevice,
  RELEASES_URL,
  REPO_URL,
  type Asset,
  type DeviceInfo,
  type Platform,
} from "./download";
import { IconApple, IconArrowUp, IconCoffee, IconExternal, IconGitHub, IconLinux, IconPlay, IconWindows } from "./icons";
import { LangProvider, useCopy, useLangToggle } from "./lang";
import { LiveIsland, openIsland, type Notice } from "./LiveIsland";
import { useMusic, type Music } from "./useMusic";
import music from "./tico-musica.mp3";
import poster from "./poster.jpg";
import videoWebm from "./tico-anuncio.webm";
import video from "../../promo/tico-anuncio.mp4";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/schibsted-grotesk/wght.css";
import "@fontsource-variable/martian-mono/standard.css";
import "./site.css";

const VERSION = __APP_VERSION__;
const BASE = "#F2F0EB";
const ACCENT = "#3DD6D0";
/** Para apoyar a Tico (el mismo enlace que el botón «Sponsor» de GitHub). */
const SUPPORT_URL = "https://buymeacoffee.com/mapachevolador";

/* ------------------------------------------------------------------ */
/* Equipo del visitante                                                */
/* ------------------------------------------------------------------ */

function useDevice(): { platform: Platform; primary: Asset | null; touch: boolean } {
  const [info, setInfo] = useState<DeviceInfo>(() => ({
    userAgent: navigator.userAgent,
    touchPoints: navigator.maxTouchPoints,
  }));
  useEffect(() => {
    let alive = true;
    void readDevice().then((next) => alive && setInfo(next));
    return () => {
      alive = false;
    };
  }, []);
  const platform = detectPlatform(info);
  return { platform, primary: primaryAsset(info), touch: platform === "mobile" };
}

let noticeId = 0;

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function Site() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}

function Page() {
  const copy = useCopy();
  const device = useDevice();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [flash, setFlash] = useState(false);
  const bgm = useMusic(music);

  useEffect(() => {
    // Todos los Ticos de la página miran al cursor.
    const move = (e: PointerEvent) => setGaze(e.clientX, e.clientY);
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Al descargar, avisa la propia isla (como haría Tico en tu escritorio).
  const onDownload = useCallback(
    (asset: Asset) => {
      const island = copy.island;
      setNotice({ id: ++noticeId, title: island.downloading(asset.file), text: island.firstRun[fileKind(asset.file)] });
    },
    [copy],
  );
  const clearNotice = useCallback(() => setNotice(null), []);

  return (
    <>
      <a className="skip" href="#contenido">
        {copy.skip}
      </a>
      <MenuBar music={bgm} />
      <LiveIsland notice={notice} onNoticeDone={clearNotice} onCapture={setFlash} beat={bgm.beat} />
      <div className={`flash${flash ? " is-on" : ""}`} aria-hidden="true" />
      <main id="contenido">
        <Hero device={device} onDownload={onDownload} beat={bgm.beat} />
        <States />
        <Phrases />
        <Cast beat={bgm.beat} />
        <Film />
        <Doesnt />
        <Downloads device={device} onDownload={onDownload} />
        <Questions />
      </main>
      <Footer />
    </>
  );
}

function DownloadLink({
  asset,
  className,
  onDownload,
  children,
}: {
  asset: Asset;
  className: string;
  onDownload: (asset: Asset) => void;
  children: ReactNode;
}) {
  // Un enlace normal: el archivo baja directo de la última versión publicada en GitHub.
  return (
    <a className={className} href={downloadUrl(asset)} rel="noopener" onClick={() => onDownload(asset)}>
      {children}
    </a>
  );
}

/* Barra de menús: la página hace de pantalla y la isla cuelga de su borde. */

function Clock() {
  const { locale } = useCopy();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  const day = now.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {day} {time}
    </time>
  );
}

/** Botón de música: barras que se mueven mientras suena. */
function MusicButton({ music }: { music: Music }) {
  const copy = useCopy().music;
  return (
    <button
      type="button"
      className={`music-btn${music.playing ? " is-on" : ""}`}
      aria-pressed={music.playing}
      aria-label={copy.aria}
      data-music-toggle=""
      title={copy.title}
      onClick={music.toggle}
    >
      <span className="music-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="music-label">{music.playing ? copy.on : copy.off}</span>
    </button>
  );
}

function MenuBar({ music }: { music: Music }) {
  const copy = useCopy();
  const toggleLang = useLangToggle();
  return (
    <header className="menubar">
      <a className="menubar-brand" href="#inicio">
        <Tico size={20} baseColor={BASE} accentColor={ACCENT} expression="idle" animated={false} />
        Tico
      </a>
      <nav className="menubar-items" aria-label={copy.nav.aria}>
        <a href="#estados">{copy.nav.island}</a>
        <a href="#frases">{copy.nav.phrases}</a>
        <a href="#ticos">{copy.nav.ticos}</a>
        <a href="#anuncio">{copy.nav.film}</a>
        <a href="#descargar">{copy.nav.download}</a>
      </nav>
      <div className="menubar-right">
        <button type="button" className="lang-btn" onClick={toggleLang} aria-label={copy.langSwitch.aria} title={copy.langSwitch.aria}>
          {copy.langSwitch.label}
        </button>
        <MusicButton music={music} />
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          <IconGitHub size={15} />
          <span className="menubar-gh">GitHub</span>
        </a>
        <Clock />
      </div>
    </header>
  );
}

/* Portada */

const PET_MOODS: Expression[] = ["happy", "love", "wink", "surprised", "proud", "dizzy", "curious"];

/** Tico en el escritorio: se arrastra, y con un clic saluda y cambia de cara. */
function PetTico({ beat }: { beat: number }) {
  const copy = useCopy().pet;
  const ref = useRef<HTMLButtonElement>(null);
  const drag = useRef({ x: 0, y: 0, startX: 0, startY: 0, baseX: 0, baseY: 0, moved: false, on: false });
  const [mood, setMood] = useState(0);
  const [wave, setWave] = useState(0);
  const expression = PET_MOODS[mood % PET_MOODS.length] ?? "happy";

  const place = () => {
    const el = ref.current;
    if (el) el.style.transform = `translate(${drag.current.x}px, ${drag.current.y}px)`;
  };

  return (
    <figure className="pet">
      <button
        ref={ref}
        type="button"
        className="pet-tico"
        aria-label={copy.aria}
        onPointerDown={(e) => {
          const d = drag.current;
          Object.assign(d, { on: true, moved: false, startX: e.clientX, startY: e.clientY, baseX: d.x, baseY: d.y });
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.on) return;
          const dx = e.clientX - d.startX;
          const dy = e.clientY - d.startY;
          if (!d.moved && Math.hypot(dx, dy) < 4) return;
          d.moved = true;
          d.x = d.baseX + dx;
          d.y = d.baseY + dy;
          place();
        }}
        onPointerUp={() => {
          drag.current.on = false;
        }}
        onClick={() => {
          if (drag.current.moved) return;
          setMood((m) => m + 1);
          setWave((w) => w + 1);
        }}
      >
        <Tico size={260} baseColor={BASE} accentColor={ACCENT} expression={expression} wave={wave} bounce={beat} />
      </button>
      <figcaption>
        <span>{copy.caption}</span>
        <span>{copy.hint}</span>
      </figcaption>
    </figure>
  );
}

function Hero({
  device,
  onDownload,
  beat,
}: {
  device: ReturnType<typeof useDevice>;
  onDownload: (asset: Asset) => void;
  beat: number;
}) {
  const { platform, primary, touch } = device;
  const copy = useCopy();
  const hero = copy.hero;
  return (
    <section className="hero" id="inicio">
      <div className="hero-try">
        <IconArrowUp />
        {touch ? (
          <span>{hero.tryTouch}</span>
        ) : (
          <span>
            {hero.tryMouse} <kbd>{hero.keys[0]}</kbd> <kbd>{hero.keys[1]}</kbd> <kbd>{hero.keys[2]}</kbd>
          </span>
        )}
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <h1>{hero.title}</h1>
          <p className="hero-lead">{hero.lead}</p>
          <div className="hero-actions">
            {primary ? (
              <DownloadLink asset={primary} className="capsule-btn" onDownload={onDownload}>
                <span className="capsule-eyes" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="capsule-btn-text">
                  {hero.downloadFor(copy.platforms[platform])}
                  <small>
                    {primary.file} · {formatMb(primary.mb, copy.locale)}
                  </small>
                </span>
              </DownloadLink>
            ) : (
              <a className="capsule-btn" href="#descargar">
                <span className="capsule-eyes" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="capsule-btn-text">
                  {hero.downloadComputer}
                  <small>{hero.allSystems}</small>
                </span>
              </a>
            )}
            <a className="text-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconGitHub size={18} />
              {hero.github}
              <IconExternal />
            </a>
          </div>
          <p className="hero-meta">
            {hero.meta(VERSION)} <a href="#descargar">{hero.allDownloads}</a>
          </p>
        </div>
        <PetTico beat={beat} />
      </div>
    </section>
  );
}

/* Los cuatro estados, dibujados a escala con las medidas reales de la app. */

const STATE_ORDER: IslandState[] = ["hidden", "peek", "compact", "expanded"];

const DRAW_SCALE = 0.5;

function StateDrawing({ id }: { id: IslandState }) {
  const size = BASE_SIZES[id];
  const w = size.width * DRAW_SCALE;
  const h = size.height * DRAW_SCALE;
  const r = id === "expanded" ? 28 * DRAW_SCALE : h / 2;
  return (
    <div className="state-draw" style={{ width: w }}>
      <div className={`state-capsule is-${id}`} style={{ width: w, height: Math.max(h, 1), borderRadius: r }}>
        {id === "peek" && <Tico size={22} baseColor={BASE} accentColor={ACCENT} expression="curious" animated={false} />}
        {id === "compact" && (
          <>
            <Tico size={22} baseColor={BASE} accentColor={ACCENT} expression="idle" animated={false} />
            <i className="state-line" />
          </>
        )}
        {id === "expanded" && (
          <>
            <Tico size={26} baseColor={BASE} accentColor={ACCENT} expression="talking" animated={false} />
            <i className="state-bubble is-you" />
            <i className="state-bubble" />
            <i className="state-bubble is-short" />
          </>
        )}
      </div>
      <span className="state-dim">
        {size.width} × {size.height}
      </span>
    </div>
  );
}

function States() {
  const copy = useCopy().states;
  return (
    <section className="section states" id="estados">
      <div className="section-head">
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <div className="states-sheet" role="img" aria-label={copy.aria}>
        <div className="states-edge">
          <span>{copy.edge}</span>
          <span>{copy.scale}</span>
        </div>
        <ol className="states-row">
          {STATE_ORDER.map((id) => (
            <li key={id}>
              <StateDrawing id={id} />
              <h3>{copy.items[id].name}</h3>
              <p>{copy.items[id].how}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Lo que le puedes decir */

function Phrases() {
  const copy = useCopy().phrases;
  return (
    <section className="section" id="frases">
      <div className="section-head">
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <dl className="phrases">
        {copy.items.map((p) => (
          <div key={p.say} className="phrase">
            <dt>{copy.quote(p.say)}</dt>
            <dd>
              <p>{p.does}</p>
              <span className="tag">{p.tag}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* Los Ticos de serie, con sus colores y su ropa reales. */

const CAST_MOODS: Expression[] = ["happy", "wink", "love", "surprised", "proud", "dizzy", "thinking"];

function CastMember({ tico, index, beat }: { tico: (typeof DEFAULT_TICOS)[number]; index: number; beat: number }) {
  const copy = useCopy().cast;
  const name = copy.names[tico.id] ?? tico.name;
  const [taps, setTaps] = useState(0);
  const expression: Expression = taps === 0 ? "idle" : (CAST_MOODS[(taps + index) % CAST_MOODS.length] ?? "happy");
  return (
    <li className="cast-member" style={{ ["--tico-accent" as string]: tico.accentColor }}>
      <button type="button" onClick={() => setTaps((t) => t + 1)} aria-label={copy.react(name)}>
        <Tico size={132} baseColor={tico.baseColor} accentColor={tico.accentColor} expression={expression} outfit={tico.outfit} wave={taps} bounce={beat} />
      </button>
      <h3>
        <i aria-hidden="true" />
        {name}
      </h3>
      <p>{copy.lines[tico.id]}</p>
    </li>
  );
}

function Cast({ beat }: { beat: number }) {
  const copy = useCopy().cast;
  return (
    <section className="section" id="ticos">
      <div className="section-head">
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul className="cast">
        {DEFAULT_TICOS.map((tico, i) => (
          <CastMember key={tico.id} tico={tico} index={i} beat={beat} />
        ))}
      </ul>
      <p className="cast-note">{copy.note}</p>
    </section>
  );
}

/* El anuncio */

function Film() {
  const copy = useCopy().film;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.controls = true;
    void el.play().catch(() => undefined);
  };
  return (
    <section className="film" id="anuncio">
      <div className="film-inner">
        <div className="film-head">
          <h2>{copy.title}</h2>
          <p>{copy.lead}</p>
        </div>
        <div className="film-window">
          <div className="film-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>tico-anuncio.mp4</span>
          </div>
          <div className="film-screen">
            <video
              ref={ref}
              poster={poster}
              preload="none"
              playsInline
              controlsList="nodownload noremoteplayback"
              onPlay={() => setPlaying(true)}
              onEnded={() => setPlaying(false)}
            >
              {/* Primero el MP4 original; WebM (VP9) para los navegadores sin H.264. */}
              <source src={video} type="video/mp4" />
              <source src={videoWebm} type="video/webm" />
              {copy.fallback}
            </video>
            {!playing && (
              <button type="button" className="film-play" onClick={play}>
                <IconPlay />
                {copy.play}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Privacidad, dicha en negativo: lo que no hace. */

function Doesnt() {
  const copy = useCopy().doesnt;
  return (
    <section className="section doesnt" id="privacidad">
      <h2>{copy.title}</h2>
      <ul>
        {copy.items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="doesnt-note">{copy.note}</p>
    </section>
  );
}

/* Descargas, como una hoja de versión. */

const PLATFORMS: {
  id: DesktopOs;
  icon: ReactNode;
  assets: Asset[];
}[] = [
  {
    id: "windows",
    icon: <IconWindows />,
    assets: [ASSETS.winX64, ASSETS.winX86, ASSETS.winX64Zip, ASSETS.winX86Zip],
  },
  {
    id: "mac",
    icon: <IconApple />,
    assets: [ASSETS.mac],
  },
  {
    id: "linux",
    icon: <IconLinux />,
    assets: [ASSETS.appImage, ASSETS.deb],
  },
];

function Downloads({
  device,
  onDownload,
}: {
  device: ReturnType<typeof useDevice>;
  onDownload: (asset: Asset) => void;
}) {
  const { platform, primary } = device;
  const copy = useCopy();
  const d = copy.downloads;
  return (
    <section className="section" id="descargar">
      <div className="section-head">
        <h2>{d.title(VERSION)}</h2>
        <p>{d.lead}</p>
      </div>
      <div className="sheet">
        {PLATFORMS.map((p) => (
          <div key={p.id} className={`sheet-group${p.id === platform ? " is-yours" : ""}`}>
            <div className="sheet-os">
              {p.icon}
              <h3>{copy.platforms[p.id]}</h3>
              {p.id === platform && <span className="tag">{d.yours}</span>}
            </div>
            <ul>
              {p.assets.map((asset) => (
                <li key={asset.file} className={asset === primary ? "is-primary" : ""}>
                  <DownloadLink asset={asset} className="sheet-row" onDownload={onDownload}>
                    <span className="sheet-label">
                      {d.assets[asset.id].label}
                      <small>{d.assets[asset.id].note}</small>
                    </span>
                    <code>{asset.file}</code>
                    <span className="sheet-size">{formatMb(asset.mb, copy.locale)}</span>
                    <span className="sheet-get">{d.get}</span>
                  </DownloadLink>
                </li>
              ))}
            </ul>
            <p className="sheet-first">
              <b>{d.firstTime}</b> {d.firstRun[p.id]}
            </p>
          </div>
        ))}
      </div>
      <p className="sheet-more">
        <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
          {d.notes}
          <IconExternal />
        </a>
      </p>
      <aside className="support">
        <p>{d.support}</p>
        <a className="support-btn" href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
          <IconCoffee />
          {d.supportButton}
        </a>
      </aside>
    </section>
  );
}

/* Preguntas (todas a la vista, sin acordeón) */

function Questions() {
  const copy = useCopy().questions;
  return (
    <section className="section" id="preguntas">
      <div className="section-head">
        <h2>{copy.title}</h2>
      </div>
      <dl className="questions">
        {copy.items.map((item) => (
          <div key={item.q}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Footer() {
  const copy = useCopy().footer;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">
          <Tico size={28} baseColor={BASE} accentColor={ACCENT} expression="sleeping" animated={false} />
          <span>
            Tico {VERSION}
            <small>{copy.madeBy}</small>
          </span>
        </p>
        <p className="footer-legal">{copy.legal}</p>
        <nav aria-label={copy.aria}>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
            {copy.releases}
          </a>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
            {copy.issues}
          </a>
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            {copy.support}
          </a>
          <button type="button" className="footer-try" onClick={openIsland}>
            {copy.openIsland}
          </button>
        </nav>
      </div>
    </footer>
  );
}
