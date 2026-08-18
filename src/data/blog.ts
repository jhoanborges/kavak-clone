// Blog hardcodeado (fase inicial). Reemplazar por CMS/DB después manteniendo esta forma.
/**
 * `id` estable por bloque: la vista lo usa como key de React en lugar del
 * índice del array. Cuando esto venga de un CMS, el id vendrá de ahí.
 */
type BlogBlockData =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'img'; src: string; alt: string }
  | { type: 'quote'; text: string };

export type BlogBlock = BlogBlockData & { id: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO 8601 para <time>/metadata
  dateLabel: string; // legible es-MX
  author: string;
  role: string;
  cover: string;
  content: BlogBlock[];
};

/**
 * Cuerpo del artículo. Recibe bloques ya escritos y les asigna un id estable.
 * Cada post pasa su propio contenido en español.
 */
function body(blocks: BlogBlockData[]): BlogBlock[] {
  return withIds(blocks);
}

/** Numera los bloques para darles una identidad estable dentro del artículo. */
function withIds(blocks: BlogBlockData[]): BlogBlock[] {
  return blocks.map((b, i) => ({ ...b, id: `${b.type}-${i}` }));
}

export const POSTS: BlogPost[] = [
  {
    slug: 'arrendamiento-puro-o-financiero',
    title: '¿Arrendamiento Puro o Financiero? Conoce cuál conviene a tu empresa',
    excerpt: 'Compara ambos esquemas y descubre cuál se adapta mejor a la operación y objetivos fiscales de tu negocio.',
    category: 'Arrendamiento',
    date: '2026-07-28',
    dateLabel: '28 Julio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'Elegir entre arrendamiento puro y financiero define cómo tu empresa registra los vehículos, cómo deduce el gasto y qué pasa con las unidades al final del contrato. No hay una opción mejor en abstracto: depende de tu flujo de caja, tu horizonte de uso y tu estrategia fiscal.' },
      { type: 'h2', text: 'Arrendamiento puro: flexibilidad y deducción total' },
      { type: 'p', text: 'En el arrendamiento puro la arrendadora conserva la propiedad del vehículo. Tu empresa paga por el uso durante un plazo fijo y, al terminar, devuelve la unidad o negocia una renovación. La renta es 100% deducible y no aparece como activo en tu balance, lo que mantiene tu capacidad de endeudamiento intacta.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: 'Arrendamiento financiero: camino hacia la propiedad' },
      { type: 'p', text: 'El arrendamiento financiero funciona como un crédito: pagas rentas que amortizan el valor del vehículo y, al final, ejerces una opción de compra por un valor residual bajo. El activo sí se registra en tu contabilidad y deduces la depreciación y los intereses. Conviene cuando planeas quedarte con las unidades a largo plazo.' },
      { type: 'quote', text: 'La regla práctica: si quieres renovar flotilla cada pocos años sin preocuparte por la reventa, elige puro. Si tu meta es capitalizar los vehículos, elige financiero.' },
      { type: 'p', text: 'Antes de decidir, corre los números con tu contador considerando el costo total del contrato, no solo la renta mensual. Un esquema con renta baja puede esconder un valor residual alto que encarece la compra final.' },
    ]),
  },
  {
    slug: 'arrendamiento-financiero-leasing-que-es',
    title: 'Arrendamiento Financiero (leasing): qué es y cómo funciona',
    excerpt: 'Todo lo que necesitas saber sobre el arrendamiento financiero y sus beneficios para tu empresa.',
    category: 'Arrendamiento',
    date: '2026-07-20',
    dateLabel: '20 Julio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'El leasing, o arrendamiento financiero, es un contrato en el que una arrendadora adquiere el vehículo que tu empresa necesita y te lo cede en uso a cambio de pagos periódicos. Al final del plazo, tienes derecho a comprarlo por un valor residual pactado desde el inicio.' },
      { type: 'h2', text: 'Cómo funciona paso a paso' },
      { type: 'p', text: 'Eliges la unidad, la arrendadora la compra y firman un contrato con plazo, renta y opción de compra definidos. Durante la vigencia pagas rentas fijas que puedes presupuestar con precisión. Al terminar, ejerces la compra, renuevas o devuelves, según lo acordado.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: 'Beneficios para tu empresa' },
      { type: 'p', text: 'El leasing preserva tu liquidez: adquieres el activo sin desembolsar el precio completo de golpe. Los intereses y la depreciación son deducibles, y las rentas fijas facilitan la planeación financiera. Además, evitas descapitalizarte para crecer tu flotilla.' },
      { type: 'quote', text: 'El leasing convierte una compra grande en pagos predecibles, liberando capital para la operación diaria de tu negocio.' },
      { type: 'p', text: 'Revisa siempre el valor residual y las condiciones de mantenimiento antes de firmar. Un buen contrato de leasing es transparente en costos y te da certeza sobre qué pasa con la unidad al cierre.' },
    ]),
  },
  {
    slug: '5-claves-manejar-flotilla',
    title: '5 claves para manejar la flotilla de tu empresa',
    excerpt: 'Buenas prácticas para administrar tu flotilla vehicular y reducir costos operativos.',
    category: 'Flotillas',
    date: '2026-07-10',
    dateLabel: '10 Julio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'Administrar una flotilla va más allá de comprar autos y asignarlos. Cada unidad genera costos de combustible, mantenimiento, seguros y tiempos muertos que, sin control, erosionan la rentabilidad. Estas cinco claves te ayudan a mantener la operación eficiente.' },
      { type: 'h2', text: '1. Centraliza la información de cada unidad' },
      { type: 'p', text: 'Lleva un registro único con kilometraje, servicios, consumo y conductor asignado. Cuando los datos están dispersos es imposible detectar la unidad que gasta de más o el patrón de fallas que anticipa una avería costosa.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: '2. Programa el mantenimiento preventivo' },
      { type: 'p', text: 'El mantenimiento reactivo siempre cuesta más: una unidad detenida es un ingreso perdido. Agenda los servicios por kilometraje o tiempo y respétalos. Prevenir alarga la vida útil y protege el valor de reventa.' },
      { type: 'quote', text: 'Cada peso invertido en mantenimiento preventivo evita varios en reparaciones de emergencia y días de inactividad.' },
      { type: 'p', text: 'Completa la estrategia midiendo el rendimiento de combustible por unidad, capacitando a los conductores en manejo eficiente y evaluando si conviene renovar en lugar de reparar. La flotilla bien gestionada baja costos y mejora el servicio.' },
    ]),
  },
  {
    slug: 'vehiculos-electricos-activo',
    title: 'Vehículos eléctricos: el activo que tu empresa necesita',
    excerpt: 'El impacto de la electromovilidad en la operación y el patrimonio de tu empresa.',
    category: 'Tendencias',
    date: '2026-06-30',
    dateLabel: '30 Junio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'Los vehículos eléctricos dejaron de ser una apuesta futurista para convertirse en una decisión de negocio. Menores costos por kilómetro, incentivos fiscales y una imagen alineada con la sostenibilidad los vuelven un activo estratégico para las empresas.' },
      { type: 'h2', text: 'Menor costo operativo por kilómetro' },
      { type: 'p', text: 'Un eléctrico tiene muchas menos piezas móviles que un motor de combustión: sin cambios de aceite, sin transmisión compleja, con frenos que se desgastan menos. Sumado al menor precio de la energía frente al combustible, el costo por kilómetro cae de forma notable.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: 'Incentivos y valor de marca' },
      { type: 'p', text: 'Muchas jurisdicciones ofrecen beneficios fiscales y exenciones para flotillas eléctricas. A eso se suma el valor reputacional: operar con cero emisiones locales fortalece tu posición ante clientes y aliados que priorizan proveedores sostenibles.' },
      { type: 'quote', text: 'Electrificar la flotilla no es solo cuidar el planeta: es blindar tu operación contra la volatilidad del precio de los combustibles.' },
      { type: 'p', text: 'Antes de migrar, evalúa tus rutas, la autonomía real que necesitas y la infraestructura de carga disponible. El arrendamiento facilita la transición: pruebas la tecnología sin comprometer capital en una compra definitiva.' },
    ]),
  },
  {
    slug: 'energia-renovable-opex',
    title: 'El impacto de la energía renovable en tu OpEx',
    excerpt: 'Cómo la eficiencia energética transforma los gastos operativos de tu empresa.',
    category: 'Finanzas',
    date: '2026-06-18',
    dateLabel: '18 Junio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'El OpEx, los gastos operativos, es donde la eficiencia energética se traduce en resultados visibles. Reducir el consumo de energía en tus instalaciones y tu flotilla libera recursos que puedes reinvertir en el crecimiento del negocio.' },
      { type: 'h2', text: 'De gasto fijo a variable controlable' },
      { type: 'p', text: 'La energía renovable convierte un costo que parecía inamovible en una variable que puedes optimizar. Paneles solares, iluminación eficiente y vehículos eléctricos reducen la factura mes a mes y te protegen de las alzas en tarifas y combustibles.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: 'Retorno de inversión medible' },
      { type: 'p', text: 'Toda inversión en eficiencia debe evaluarse por su periodo de recuperación. Muchos proyectos renovables se amortizan en pocos años y luego generan ahorro neto durante toda su vida útil, mejorando de forma sostenida tu margen operativo.' },
      { type: 'quote', text: 'Cada kilowatt que no consumes es utilidad directa: la eficiencia energética es el ahorro que no depende de vender más.' },
      { type: 'p', text: 'Empieza por medir tu consumo actual, identifica los focos de mayor gasto y prioriza las intervenciones con mejor retorno. La combinación de energía limpia y flotilla eléctrica es una de las palancas más rentables para bajar tu OpEx.' },
    ]),
  },
  {
    slug: 'credito-automotriz-empresas',
    title: 'Crédito Automotriz para empresas: cuándo conviene',
    excerpt: 'Ventajas del crédito automotriz frente a otras formas de adquirir tu flotilla.',
    category: 'Crédito',
    date: '2026-06-05',
    dateLabel: '5 Junio, 2026',
    author: 'Equipo editorial',
    role: 'Especialistas en movilidad empresarial',
    cover: '/images/blog-1.jpg',
    content: body([
      { type: 'p', text: 'El crédito automotriz sigue siendo una vía sólida para adquirir vehículos empresariales cuando la meta es la propiedad desde el primer día. A diferencia del arrendamiento, cada pago te acerca a ser dueño pleno de la unidad, que entra a tu balance como activo.' },
      { type: 'h2', text: 'Cuándo conviene el crédito' },
      { type: 'p', text: 'Conviene cuando planeas usar los vehículos durante muchos años, cuando el kilometraje anual es alto y la reventa no es prioridad, o cuando prefieres construir patrimonio en lugar de pagar solo por el uso. También si ya cuentas con liquidez para un enganche competitivo.' },
      { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
      { type: 'h2', text: 'Qué evaluar antes de firmar' },
      { type: 'p', text: 'Compara la tasa de interés, el enganche requerido y el costo anual total, no solo la mensualidad. Revisa comisiones por apertura y condiciones de prepago. Un crédito con mensualidad baja pero plazo largo puede terminar costando más que un esquema más corto.' },
      { type: 'quote', text: 'El crédito tiene sentido cuando el vehículo es una herramienta de largo plazo; el arrendamiento, cuando la prioridad es flexibilidad y renovación.' },
      { type: 'p', text: 'Analiza tu flujo de caja y tu estrategia fiscal con tu contador. La decisión correcta equilibra el costo financiero, el impacto contable y el uso real que dará tu empresa a la flotilla.' },
    ]),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
