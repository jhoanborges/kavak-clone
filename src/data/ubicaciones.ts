// Oficinas Value (datos reales). Coords x/y = posición del pin (%) en el mapa estilizado.
export type Oficina = {
  id: string;
  ciudad: string;
  estado: string;
  entidad: 'Casa de Bolsa' | 'Arrendadora';
  direccion: string;
  telefonos: string[];
  horario: string;
  imagen: string;
  pin: { x: number; y: number };
};

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// Oficinas de atención (Casa de Bolsa) mostradas en el mapa interactivo.
export const OFICINAS: Oficina[] = [
  {
    id: 'chihuahua',
    ciudad: 'Chihuahua',
    estado: 'Chihuahua',
    entidad: 'Casa de Bolsa',
    direccion: 'Ave. Cuauhtémoc No. 2212, Colonia Cuauhtémoc, CP 31020, Chihuahua, Chihuahua',
    telefonos: ['(614) 4399 400'],
    horario: 'Lunes a viernes - 9:00 a 18:00 h',
    imagen: '/images/CHIH.png',
    pin: { x: 34, y: 16 },
  },
  {
    id: 'monterrey',
    ciudad: 'Monterrey',
    estado: 'Nuevo León',
    entidad: 'Casa de Bolsa',
    direccion: 'Ave. Bosques del Valle No. 106 Pte, Colonia Bosques del Valle, CP 66250, San Pedro Garza García, Nuevo León',
    telefonos: ['(81) 8399-2222', '(81) 8356-5555'],
    horario: 'Lunes a viernes - 9:00 a 18:00 h',
    imagen: '/images/MTY.png',
    pin: { x: 58, y: 32 },
  },
  {
    id: 'guadalajara',
    ciudad: 'Guadalajara',
    estado: 'Jalisco',
    entidad: 'Casa de Bolsa',
    direccion: 'José Ma. Vigil No. 2735, esquina con Ontario, Colonia Providencia, CP 44620, Guadalajara, Jalisco',
    telefonos: ['(33) 3648-6800'],
    horario: 'Lunes a viernes - 9:00 a 18:00 h',
    imagen: '/images/GDJ.png',
    pin: { x: 33, y: 62 },
  },
  {
    id: 'cdmx',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    entidad: 'Casa de Bolsa',
    direccion: 'Prol. Paseo de la Reforma No. 1015, Punta Santa Fe, Torre B, Piso 10, Col. Santa Fe Cuajimalpa, CP 01376, Álvaro Obregón, CDMX',
    telefonos: ['(55) 9177-7800'],
    horario: 'Lunes a viernes - 9:00 a 18:00 h',
    imagen: '/images/CDMX.png',
    pin: { x: 56, y: 73 },
  },
];

// Sede corporativa de Value Arrendadora (San Pedro Garza García) - sección destacada aparte.
export const SEDE: Oficina = {
  id: 'san-pedro',
  ciudad: 'San Pedro Garza García',
  estado: 'Nuevo León',
  entidad: 'Arrendadora',
  direccion: 'Calzada Mauricio Fernández Garza 202 Sur, Colonia Del Valle, CP 66220, San Pedro Garza García, Nuevo León',
  telefonos: ['+52 (81) 8153 9500'],
  horario: 'Lunes a viernes - 8:30 a 17:00 h',
  imagen: '/images/ARRENDA.png',
  pin: { x: 48, y: 40 },
};

export const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, '')}`;
export const mapsHref = (o: Oficina) => maps(`Value ${o.ciudad} ${o.direccion}`);
