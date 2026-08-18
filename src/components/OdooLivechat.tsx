import Script from "next/script";

/**
 * Widget de chat en vivo de Odoo (hexagun.odoo.com).
 *
 * `strategy="lazyOnload"`: la doc de next/script marca los "chat support plugins"
 * como el caso exacto de esta estrategia. Se inyectan en el cliente durante el
 * tiempo idle del navegador, DESPUÉS de que el resto de recursos cargó, así el
 * chat no compite con el contenido ni penaliza LCP/hidratación.
 *
 * `loader` primero (arranca el widget) y luego `assets_embed` (sus assets); los
 * `id` evitan que Next duplique el script entre navegaciones.
 */
const ODOO_URL = "https://hexagun.odoo.com";

export default function OdooLivechat() {
  return (
    <>
      <Script
        id="odoo-livechat-loader"
        src={`${ODOO_URL}/im_livechat/loader/1`}
        strategy="lazyOnload"
      />
      <Script
        id="odoo-livechat-assets"
        src={`${ODOO_URL}/im_livechat/assets_embed.js`}
        strategy="lazyOnload"
      />
    </>
  );
}
