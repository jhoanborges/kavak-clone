import type { Instrumentation } from "next";

import { DEBUG } from "@/lib/log";

/**
 * Red de seguridad de errores del SERVIDOR.
 *
 * `onRequestError` lo dispara Next SÓLO con errores que NO capturamos nosotros:
 * throws en render de Server Components, en route handlers sin try/catch, en
 * Server Actions, etc. Los fallos del webservice que YA atrapamos (tradein /
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
