import type { Instrumentation } from "next";

import { DEBUG } from "@/lib/log";

/**
 * Arranque del server. Corre UNA vez, antes de atender peticiones.
 *
 * Si NODE_TLS_REJECT_UNAUTHORIZED=0, DESACTIVA la verificación de certificados
 * TLS de forma global para el `fetch` de Node (undici). Necesario porque el
 * backend de prod (https IP interna) usa un certificado self-signed
 * (SELF_SIGNED_CERT_IN_CHAIN) y undici IGNORA la env var por sí sola: hay que
 * fijarle un dispatcher explícito. INSEGURO: sólo para redes internas de confianza.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0") return;

  const { setGlobalDispatcher, Agent } = await import("undici");
  setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }));
  console.warn(
    "[tls] Verificación de certificados TLS DESACTIVADA (NODE_TLS_REJECT_UNAUTHORIZED=0). Sólo para backends internos de confianza."
  );
}

/**
 * Red de seguridad de errores del SERVIDOR.
 *
 * `onRequestError` lo dispara Next SÓLO con errores que NO capturamos nosotros:
 * throws en render de Server Components, en route handlers sin try/catch, en
 * Server Actions, etc. Los fallos del webservice que YA atrapamos (catalogo /
 * preestudio) se loguean en su propio sitio (ver src/lib/log.ts); acá caen los
 * inesperados que antes sólo aparecían como un 500 mudo.
 *
 * En dev imprime path + contexto + stack; en prod, una línea.
 */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const e = err as { digest?: string } & Error;

  if (!DEBUG) {
    console.error(`[req-error] ${request.method} ${request.path} → ${e.message}`);
    return;
  }

  console.error(`\n════════ REQUEST ERROR ════════`);
  console.error(`  ${request.method} ${request.path}`);
  console.error(`  route  : ${context.routePath} (${context.routeType})`);
  if (e.digest) console.error(`  digest : ${e.digest}`);
  console.error(`  error  : ${e.name}: ${e.message}`);
  if (e.stack) console.error(e.stack);
  console.error(`════════════════════════════════\n`);
};
