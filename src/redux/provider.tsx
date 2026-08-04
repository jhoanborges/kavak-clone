"use client";

import { Provider } from "react-redux";
import { store } from "./store";

/**
 * OJO — aquí NO va `PersistGate`.
 *
 * PersistGate no renderiza a sus hijos hasta que redux-persist rehidrata desde
 * localStorage, algo que sólo ocurre en el navegador. Como este provider
 * envuelve toda la app, el HTML del servidor de TODAS las rutas salía siendo
 * únicamente el spinner de carga: sin <h1>, sin contenido, sin JSON-LD.
 * Google indexaba páginas vacías y el LCP se disparaba.
 *
 * Lo único persistido son los filtros del catálogo y los favoritos
 * (whitelist: ["cars"] en store.ts), que consumen 3 componentes. `persistStore`
 * se sigue ejecutando desde store.ts y rehidrata en cuanto monta el cliente;
 * el coste es que esos 3 componentes pintan un instante con el estado inicial
 * antes de recibir el guardado. Ese parpadeo es infinitamente más barato que
 * servir el sitio entero sin contenido.
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
