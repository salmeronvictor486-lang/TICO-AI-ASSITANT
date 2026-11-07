import { describe, expect, it } from "vitest";
import { COPY, fileKind, formatMb, langFromNavigator, pickLang } from "./copy";

describe("idioma", () => {
  it("castellano para es, ca, gl y eu; inglés para el resto", () => {
    expect(langFromNavigator(["es-ES", "en"])).toBe("es");
    expect(langFromNavigator(["ca"])).toBe("es");
    expect(langFromNavigator(["en-US", "es"])).toBe("en");
    expect(langFromNavigator(["fr-FR"])).toBe("en");
    expect(langFromNavigator([])).toBe("es");
  });

  it("?lang= gana a lo guardado, y lo guardado al navegador", () => {
    expect(pickLang("?lang=en", "es", ["es"])).toBe("en");
    expect(pickLang("", "en", ["es"])).toBe("en");
    expect(pickLang("?lang=fr", null, ["es-MX"])).toBe("es");
  });
});

describe("textos", () => {
  it("los dos idiomas tienen las mismas listas", () => {
    expect(COPY.en.phrases.items).toHaveLength(COPY.es.phrases.items.length);
    expect(COPY.en.doesnt.items).toHaveLength(COPY.es.doesnt.items.length);
    expect(COPY.en.questions.items).toHaveLength(COPY.es.questions.items.length);
    expect(Object.keys(COPY.en.cast.lines)).toEqual(Object.keys(COPY.es.cast.lines));
  });

  it("tamaños con la coma o el punto de cada idioma", () => {
    expect(formatMb(4.4, "es-ES")).toBe("4,4 MB");
    expect(formatMb(4.4, "en-GB")).toBe("4.4 MB");
    expect(formatMb(85, "en-GB")).toBe("85 MB");
  });

  it("consejo de la primera vez según el archivo", () => {
    expect(fileKind("Tico-macOS.dmg")).toBe("dmg");
    expect(fileKind("Tico-Linux-x86_64.AppImage")).toBe("appimage");
    expect(fileKind("Tico-Windows-x64-setup.exe")).toBe("exe");
  });
});
