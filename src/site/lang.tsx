import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { COPY, pickLang, type Copy, type Lang } from "./copy";

const STORAGE_KEY = "tico-web-idioma";

const TITLES: Record<Lang, string> = {
  es: "Tico · El asistente que vive arriba de tu pantalla",
  en: "Tico · The assistant that lives at the top of your screen",
};

function savedLang(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

interface LangState {
  copy: Copy;
  toggle: () => void;
}

const LangContext = createContext<LangState>({ copy: COPY.es, toggle: () => undefined });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => pickLang(window.location.search, savedLang(), navigator.languages));

  // El idioma de la página también para lectores de pantalla, buscadores y la pestaña.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => {
      const next: Lang = current === "es" ? "en" : "es";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Sin almacenamiento: el cambio vale para esta visita.
      }
      return next;
    });
  }, []);

  return <LangContext value={{ copy: COPY[lang], toggle }}>{children}</LangContext>;
}

export function useCopy(): Copy {
  return useContext(LangContext).copy;
}

export function useLangToggle(): () => void {
  return useContext(LangContext).toggle;
}
