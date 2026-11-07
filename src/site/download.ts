/**
 * Descargas de la web: qué archivo le toca a cada sistema. Los enlaces van a
 * `releases/latest/download/<archivo>` (nombres fijos, sin versión), así siempre bajan
 * la última versión publicada sin tocar la web.
 */

export const REPO_URL = "https://github.com/salmeronvictor486-lang/TICO-AI-ASSITANT";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;

export type Platform = "windows" | "mac" | "linux" | "mobile" | "unknown";

export type AssetId = "winX64" | "winX64Zip" | "winX86" | "winX86Zip" | "mac" | "appImage" | "deb";

export interface Asset {
  id: AssetId;
  file: string;
  /** Tamaño aproximado en MB (el de la 1.2.0; cambia poco entre versiones). */
  mb: number;
}

/** Los textos de cada archivo (para qué sirve) están en `copy.ts`, en cada idioma. */
export const ASSETS = {
  winX64: { id: "winX64", file: "Tico-Windows-x64-setup.exe", mb: 4.4 },
  winX64Zip: { id: "winX64Zip", file: "Tico-Windows-x64-portable.zip", mb: 5.5 },
  winX86: { id: "winX86", file: "Tico-Windows-x86-setup.exe", mb: 4.0 },
  winX86Zip: { id: "winX86Zip", file: "Tico-Windows-x86-portable.zip", mb: 4.9 },
  mac: { id: "mac", file: "Tico-macOS.dmg", mb: 10.6 },
  appImage: { id: "appImage", file: "Tico-Linux-x86_64.AppImage", mb: 85 },
  deb: { id: "deb", file: "Tico-Linux-amd64.deb", mb: 6.4 },
} satisfies Record<AssetId, Asset>;

export function downloadUrl(asset: Asset): string {
  return `${RELEASES_URL}/download/${asset.file}`;
}

/** Lo que el navegador cuenta del equipo (todo opcional: cada navegador da lo suyo). */
export interface DeviceInfo {
  userAgent: string;
  /** `navigator.userAgentData.platform` (Chrome y Edge). */
  platform?: string;
  /** `navigator.maxTouchPoints`: el iPad dice ser un Mac, pero tiene pantalla táctil. */
  touchPoints?: number;
  /** Pistas de alta entropía de Chrome/Edge: "x86" o "arm", y "64" o "32". */
  architecture?: string;
  bitness?: string;
  /** En Windows, "13.0.0" o más es Windows 11. */
  platformVersion?: string;
}

export function detectPlatform(info: DeviceInfo): Platform {
  const ua = info.userAgent;
  const platform = (info.platform ?? "").toLowerCase();
  if (/android|iphone|ipad|ipod/i.test(ua) || platform === "android" || platform === "ios") {
    return "mobile";
  }
  if (platform === "windows" || /windows nt/i.test(ua)) return "windows";
  if (platform === "macos" || /macintosh|mac os x/i.test(ua)) {
    return (info.touchPoints ?? 0) > 1 ? "mobile" : "mac";
  }
  if (platform === "linux" || platform === "chrome os" || /linux|cros/i.test(ua)) return "linux";
  return "unknown";
}

/**
 * Instalador de Windows que conviene. El de 32 bits es para Windows de 32 bits y para
 * Windows 10 ARM, que no emula programas de 64 bits (Windows 11 ARM sí).
 */
export function windowsAsset(info: DeviceInfo): Asset {
  if (info.architecture === "arm") {
    const major = Number.parseInt(info.platformVersion ?? "", 10);
    return Number.isFinite(major) && major >= 13 ? ASSETS.winX64 : ASSETS.winX86;
  }
  if (info.bitness === "32") return ASSETS.winX86;
  if (info.bitness === "64") return ASSETS.winX64;
  // Sin pistas: un Windows de 64 bits siempre lo dice en el user agent.
  return /win64|wow64|x64|amd64/i.test(info.userAgent) ? ASSETS.winX64 : ASSETS.winX86;
}

/** El archivo principal para este equipo, o `null` si no hay versión (móvil, desconocido). */
export function primaryAsset(info: DeviceInfo): Asset | null {
  switch (detectPlatform(info)) {
    case "windows":
      return windowsAsset(info);
    case "mac":
      return ASSETS.mac;
    case "linux":
      return ASSETS.appImage;
    default:
      return null;
  }
}

interface UADataLike {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
}

/** Lee lo que se pueda del navegador actual. Nunca falla: sin pistas, solo el user agent. */
export async function readDevice(): Promise<DeviceInfo> {
  const nav = navigator as Navigator & { userAgentData?: UADataLike };
  const info: DeviceInfo = { userAgent: nav.userAgent, touchPoints: nav.maxTouchPoints };
  const data = nav.userAgentData;
  if (data?.platform) info.platform = data.platform;
  try {
    const hints = await data?.getHighEntropyValues?.(["architecture", "bitness", "platformVersion"]);
    if (typeof hints?.architecture === "string") info.architecture = hints.architecture;
    if (typeof hints?.bitness === "string") info.bitness = hints.bitness;
    if (typeof hints?.platformVersion === "string") info.platformVersion = hints.platformVersion;
  } catch {
    // Algunos navegadores no dan las pistas: nos quedamos con el user agent.
  }
  return info;
}
