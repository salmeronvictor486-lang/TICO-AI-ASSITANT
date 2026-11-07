# Seguridad

*English below.*

## Versiones con arreglos de seguridad

| Versión | Soporte |
| ------- | ------- |
| 1.2.x   | ✅ Sí   |
| < 1.2   | ❌ No: actualiza a la [última versión](https://github.com/salmeronvictor486-lang/ROBOT-ASISTENTE/releases/latest) |

Tico avisa solo cuando hay una versión nueva (Ajustes → Sistema).

## Cómo avisar de un fallo de seguridad

**No abras un issue público**: cualquiera podría aprovecharlo antes de que esté arreglado.

1. Entra en [Security → Report a vulnerability](https://github.com/salmeronvictor486-lang/ROBOT-ASISTENTE/security/advisories/new).
   Es un aviso privado: solo lo vemos tú y yo.
2. Cuenta qué pasa, en qué sistema (Windows, macOS o Linux) y con qué versión de Tico, y los
   pasos para reproducirlo. Si tienes una prueba de concepto, mejor.

Intento responder en menos de una semana. Te diré si lo puedo reproducir y, si es un fallo de
verdad, cuándo saldrá el arreglo. Cuando esté publicado, si quieres, aparecerás en las notas de
la versión como quien lo encontró.

## Qué entra

- La app de escritorio: la isla, el chat, las capturas de pantalla, la lectura de archivos,
  el envío de correo y la base de datos local.
- Cómo guarda tus claves (llavero del sistema) y tus datos (`tico.db`, en tu ordenador).
- Los instaladores publicados en las Releases y la web de Tico.

No entra: los fallos de los servicios de IA que elijas (Claude, OpenAI, Gemini…), ni el aviso
de Windows o macOS al abrir una app sin firma de pago, que es conocido y está explicado en el
README.

## Lo que Tico ya hace para protegerte

- Las claves de IA y la contraseña del correo van al llavero del sistema, nunca a un archivo.
- Solo captura la pantalla cuando se lo pides, la imagen no se guarda en el disco y no captura
  si hay a la vista una app bloqueada (bancos, gestores de contraseñas…).
- No tiene servidores propios ni telemetría.
- La interfaz tiene una política de seguridad de contenido (CSP) estricta y las respuestas de la
  IA se pintan sin HTML (`dangerouslySetInnerHTML` no se usa).
- Los instaladores se compilan a la vista en GitHub Actions.

---

## English

Supported: **1.2.x**. Please **do not open a public issue** for security problems: report them
privately through [Security → Report a vulnerability](https://github.com/salmeronvictor486-lang/ROBOT-ASISTENTE/security/advisories/new),
with your OS, the Tico version and steps to reproduce. I aim to reply within a week.
