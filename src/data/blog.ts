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

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam iaculis nisl at mollis. In bibendum lacus vel urna lacinia rhoncus. Curabitur tempus mauris sem, nec ornare enim commodo vel. Etiam ut urna eu dolor lacinia vulputate.';

function body(): BlogBlock[] {
  return withIds([
    { type: 'p', text: LOREM },
    { type: 'h2', text: 'Recursos para impulsar tu negocio' },
    { type: 'p', text: LOREM },
    { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
    { type: 'h2', text: 'Recursos para impulsar tu negocio' },
    { type: 'p', text: LOREM },
    { type: 'quote', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam iaculis nisl at mollis. In bibendum lacus vel urna lacinia.' },
    { type: 'p', text: LOREM },
    { type: 'img', src: '/images/blog-1.jpg', alt: 'Entrega de llaves de un vehículo en arrendamiento' },
    { type: 'p', text: LOREM },
  ]);
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
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
  {
    slug: 'arrendamiento-financiero-leasing-que-es',
    title: 'Arrendamiento Financiero (leasing): qué es y cómo funciona',
    excerpt: 'Todo lo que necesitas saber sobre el arrendamiento financiero y sus beneficios para tu empresa.',
    category: 'Arrendamiento',
    date: '2026-07-20',
    dateLabel: '20 Julio, 2026',
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
  {
    slug: '5-claves-manejar-flotilla',
    title: '5 claves para manejar la flotilla de tu empresa',
    excerpt: 'Buenas prácticas para administrar tu flotilla vehicular y reducir costos operativos.',
    category: 'Flotillas',
    date: '2026-07-10',
    dateLabel: '10 Julio, 2026',
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
  {
    slug: 'vehiculos-electricos-activo',
    title: 'Vehículos eléctricos: el activo que tu empresa necesita',
    excerpt: 'El impacto de la electromovilidad en la operación y el patrimonio de tu empresa.',
    category: 'Tendencias',
    date: '2026-06-30',
    dateLabel: '30 Junio, 2026',
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
  {
    slug: 'energia-renovable-opex',
    title: 'El impacto de la energía renovable en tu OpEx',
    excerpt: 'Cómo la eficiencia energética transforma los gastos operativos de tu empresa.',
    category: 'Finanzas',
    date: '2026-06-18',
    dateLabel: '18 Junio, 2026',
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
  {
    slug: 'credito-automotriz-empresas',
    title: 'Crédito Automotriz para empresas: cuándo conviene',
    excerpt: 'Ventajas del crédito automotriz frente a otras formas de adquirir tu flotilla.',
    category: 'Crédito',
    date: '2026-06-05',
    dateLabel: '5 Junio, 2026',
    author: 'Nombre Apellido',
    role: 'Puesto / posición',
    cover: '/images/blog-1.jpg',
    content: body(),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
