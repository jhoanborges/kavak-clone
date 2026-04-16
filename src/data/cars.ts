export interface Car {
  id: number;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  monthly: number;
  km: number;
  transmission: "Automático" | "Manual";
  fuel: "Gasolina" | "Híbrido" | "Eléctrico";
  bodyType: "SUV" | "Sedan" | "Hatchback" | "Pickup" | "Minivan" | "Coupe";
  color: string;
  image: string;
  badge?: string;
  certified: boolean;
  doors: number;
  seats: number;
}

// ── Unsplash photo pools by body type ─────────────────────────────────────────
const pool = {
  sedan: [
    "photo-1541899481282-d53bffe3c35d",
    "photo-1494976388531-d1058494cdd8",
    "photo-1502877338535-766e1452684a",
    "photo-1549317661-bd32c8ce0db2",
    "photo-1580273916550-e323be2ae537",
    "photo-1549399542-7e3f8b79c341",
    "photo-1621007947382-bb3c3994e3fb",
    "photo-1542362567-b07e54358753",
  ],
  suv: [
    "photo-1533473359331-0135ef1b58bf",
    "photo-1606664515524-ed2f786a0bd6",
    "photo-1616422285623-13ff0162193c",
    "photo-1555215695-3004980ad54e",
    "photo-1567818735868-e71b99932e29",
    "photo-1553440569-bcc63803a83d",
    "photo-1519641471654-76ce0107ad1b",
    "photo-1551830820-330a71b99659",
  ],
  hatchback: [
    "photo-1503376780353-7e6692767b70",
    "photo-1552519507-da3b142c6e3d",
    "photo-1541899481282-d53bffe3c35d",
    "photo-1494976388531-d1058494cdd8",
  ],
  pickup: [
    "photo-1558618666-fcd25c85cd64",
    "photo-1504215680853-026ed2a45def",
    "photo-1583121274602-3e2820c69888",
  ],
  coupe: [
    "photo-1580274455191-1c62238fa333",
    "photo-1544636331-e26879cd4d9b",
    "photo-1552519507-da3b142c6e3d",
    "photo-1494905998402-395d579af36f",
  ],
  minivan: [
    "photo-1533473359331-0135ef1b58bf",
    "photo-1519641471654-76ce0107ad1b",
  ],
};

let _counters: Record<string, number> = {};
function img(type: keyof typeof pool): string {
  _counters[type] = (_counters[type] ?? 0) % pool[type].length;
  const id = pool[type][_counters[type]++];
  return `https://images.unsplash.com/${id}?w=600&h=400&fit=crop&auto=format`;
}

// ── Car catalogue ─────────────────────────────────────────────────────────────
export const CARS: Car[] = [
  // ── Acura ──────────────────────────────────────────────────────────────────
  { id: 1,  brand:"Acura",         model:"RDX",         variant:"2.0 TURBO ADVANCE SH-AWD",      year:2022, price:699900,  monthly:11899, km:18400,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A2E", image:img("suv"),      badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 2,  brand:"Acura",         model:"TLX",         variant:"2.0 TURBO ADVANCE FWD",         year:2023, price:749900,  monthly:12499, km:8200,   transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#FFFFFF",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Alfa Romeo ─────────────────────────────────────────────────────────────
  { id: 3,  brand:"Alfa Romeo",    model:"Stelvio",     variant:"2.0 TURBO VELOCE AT8 AWD",      year:2022, price:849900,  monthly:14299, km:22100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#8E0000",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 4,  brand:"Alfa Romeo",    model:"Giulia",      variant:"2.0 TURBO SUPER AT8",           year:2021, price:699900,  monthly:11899, km:34500,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#C0392B",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Audi ───────────────────────────────────────────────────────────────────
  { id: 5,  brand:"Audi",          model:"Q5",          variant:"2.0 TFSI SELECT QUATTRO S TRONIC",year:2022,price:729900, monthly:12299, km:26700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 6,  brand:"Audi",          model:"A3",          variant:"1.5 TFSI DYNAMIC S TRONIC",     year:2023, price:589900,  monthly:9899,  km:9100,   transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#BDC3C7",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 7,  brand:"Audi",          model:"Q3",          variant:"1.4 TFSI SELECT S TRONIC",      year:2021, price:549900,  monthly:9299,  km:41200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#FFFFFF",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Baic ───────────────────────────────────────────────────────────────────
  { id: 8,  brand:"Baic",          model:"X35",         variant:"1.5 TURBO LUXURY CVT",          year:2023, price:279900,  monthly:4799,  km:6500,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 9,  brand:"Baic",          model:"X55",         variant:"1.5 TURBO ELITE CVT",           year:2022, price:319900,  monthly:5499,  km:21300,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2980B9",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── BMW ────────────────────────────────────────────────────────────────────
  { id: 10, brand:"BMW",           model:"X3",          variant:"XDRIVE30I XLINE STEPTRONIC",    year:2022, price:849900,  monthly:14299, km:19800,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 11, brand:"BMW",           model:"Serie 3",     variant:"320I M SPORT STEPTRONIC",       year:2023, price:779900,  monthly:12999, km:7400,   transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#F5F5F5",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 12, brand:"BMW",           model:"X1",          variant:"SDRIVE18I XLINE AT",            year:2021, price:579900,  monthly:9799,  km:38600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#7F8C8D",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Buick ──────────────────────────────────────────────────────────────────
  { id: 13, brand:"Buick",         model:"Envision",    variant:"2.0 TURBO AVENIR AWD AT",       year:2022, price:599900,  monthly:10099, km:24700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#D5D5D5",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 14, brand:"Buick",         model:"Encore GX",   variant:"1.3 TURBO PREFERRED FWD CVT",   year:2023, price:479900,  monthly:8099,  km:11200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0392B",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── BYD ────────────────────────────────────────────────────────────────────
  { id: 15, brand:"BYD",           model:"Atto 3",      variant:"EXTENDED RANGE",                year:2023, price:559900,  monthly:9499,  km:12800,  transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#2ECC71",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 16, brand:"BYD",           model:"Dolphin",     variant:"STANDARD RANGE",                year:2024, price:469900,  monthly:7999,  km:4200,   transmission:"Automático", fuel:"Eléctrico", bodyType:"Hatchback",color:"#3498DB", image:img("hatchback"),badge:"Nuevo ingreso",certified:true, doors:5, seats:5 },

  // ── Cadillac ───────────────────────────────────────────────────────────────
  { id: 17, brand:"Cadillac",      model:"XT5",         variant:"3.6 PREMIUM LUXURY AWD AT",     year:2022, price:849900,  monthly:14299, km:21500,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1C1C1C",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 18, brand:"Cadillac",      model:"CT5",         variant:"2.0 TURBO SPORT AT",            year:2021, price:699900,  monthly:11899, km:35800,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#2C3E50",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Changan ────────────────────────────────────────────────────────────────
  { id: 19, brand:"Changan",       model:"CS55 Plus",   variant:"1.5 TURBO ELITE CVT",           year:2023, price:349900,  monthly:5999,  km:8900,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E67E22",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 20, brand:"Changan",       model:"Alsvin",      variant:"1.4 TURBO LUXURY CVT",          year:2022, price:249900,  monthly:4299,  km:28400,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#F1C40F",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Chevrolet ──────────────────────────────────────────────────────────────
  { id: 21, brand:"Chevrolet",     model:"Aveo",        variant:"1.5 LT AT",                     year:2022, price:189900,  monthly:3299,  km:28400,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#C0392B",  image:img("sedan"),   badge:"Más vendido",  certified:true,  doors:4, seats:5 },
  { id: 22, brand:"Chevrolet",     model:"Tracker",     variant:"1.0 TURBO PREMIER AT",          year:2023, price:349900,  monthly:5999,  km:11200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#27AE60",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 23, brand:"Chevrolet",     model:"Equinox",     variant:"1.5 TURBO PREMIER FWD CVT",     year:2021, price:379900,  monthly:6499,  km:42100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#BDC3C7",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Chirey ─────────────────────────────────────────────────────────────────
  { id: 24, brand:"Chirey",        model:"Tiggo 7 Pro", variant:"1.5 TURBO ELITE CVT",           year:2023, price:329900,  monthly:5699,  km:9800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#8E44AD",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 25, brand:"Chirey",        model:"Tiggo 4 Pro", variant:"1.5 TURBO COMFORT CVT",         year:2022, price:269900,  monthly:4599,  km:23100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2980B9",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Chrysler ───────────────────────────────────────────────────────────────
  { id: 26, brand:"Chrysler",      model:"300",         variant:"3.6 V6 LIMITED AT AWD",         year:2020, price:449900,  monthly:7699,  km:51200,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#1A1A1A",  image:img("sedan"),                         certified:false, doors:4, seats:5 },
  { id: 27, brand:"Chrysler",      model:"Pacifica",    variant:"3.6 TOURING PLUS AT FWD",       year:2021, price:499900,  monthly:8499,  km:38700,  transmission:"Automático", fuel:"Gasolina", bodyType:"Minivan",  color:"#7F8C8D",  image:img("minivan"),                       certified:true,  doors:4, seats:7 },

  // ── Cupra ──────────────────────────────────────────────────────────────────
  { id: 28, brand:"Cupra",         model:"Formentor",   variant:"1.5 TSI STYLE DSG",             year:2023, price:579900,  monthly:9799,  km:7200,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0392B",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 29, brand:"Cupra",         model:"Born",        variant:"58 KWH",                        year:2023, price:649900,  monthly:10999, km:5100,   transmission:"Automático", fuel:"Eléctrico", bodyType:"Hatchback",color:"#2C3E50", image:img("hatchback"),badge:"Nuevo ingreso",certified:true, doors:5, seats:5 },

  // ── Dodge ──────────────────────────────────────────────────────────────────
  { id: 30, brand:"Dodge",         model:"Journey",     variant:"2.4 SXT PLUS FWD AT",           year:2021, price:349900,  monthly:5999,  km:44600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2980B9",  image:img("suv"),                           certified:true,  doors:4, seats:7 },
  { id: 31, brand:"Dodge",         model:"Charger",     variant:"3.6 V6 SXT AT RWD",             year:2020, price:479900,  monthly:8199,  km:55800,  transmission:"Automático", fuel:"Gasolina", bodyType:"Coupe",    color:"#1A1A1A",  image:img("coupe"),                         certified:false, doors:4, seats:5 },

  // ── Fiat ───────────────────────────────────────────────────────────────────
  { id: 32, brand:"Fiat",          model:"Pulse",       variant:"1.0 TURBO IMPETUS AT",          year:2023, price:309900,  monthly:5299,  km:8700,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 33, brand:"Fiat",          model:"Cronos",      variant:"1.3 DRIVE MT",                  year:2022, price:219900,  monthly:3799,  km:31200,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Sedan",    color:"#F39C12",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Ford ───────────────────────────────────────────────────────────────────
  { id: 34, brand:"Ford",          model:"Escape",      variant:"1.5 ECOBOOST SE AT FWD",        year:2021, price:379900,  monthly:6499,  km:37800,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#95A5A6",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 35, brand:"Ford",          model:"Bronco Sport","variant":"2.0 ECOBOOST BIG BEND 4X4 AT",year:2022, price:529900,  monthly:8999,  km:19600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1ABC9C",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 36, brand:"Ford",          model:"Mustang",     variant:"5.0 GT FASTBACK MT",            year:2020, price:599900,  monthly:9999,  km:31400,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Coupe",    color:"#C0392B",  image:img("coupe"),   badge:"Destacado",    certified:true,  doors:2, seats:4 },

  // ── GAC ────────────────────────────────────────────────────────────────────
  { id: 37, brand:"GAC",           model:"GS4",         variant:"1.5 TURBO LUXURY CVT",          year:2023, price:319900,  monthly:5499,  km:7800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 38, brand:"GAC",           model:"Emkoo",       variant:"1.5 TURBO ELITE CVT",           year:2024, price:369900,  monthly:6299,  km:3200,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E8E8E8",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Geely ──────────────────────────────────────────────────────────────────
  { id: 39, brand:"Geely",         model:"Coolray",     variant:"1.5 TURBO SPORT AT",            year:2022, price:289900,  monthly:4999,  km:28100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#3498DB",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 40, brand:"Geely",         model:"Tugella",     variant:"2.0 TURBO ELITE 4WD AT",        year:2023, price:449900,  monthly:7699,  km:9200,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── GMC ────────────────────────────────────────────────────────────────────
  { id: 41, brand:"GMC",           model:"Terrain",     variant:"1.5 TURBO SLE FWD AT",          year:2022, price:449900,  monthly:7699,  km:23400,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#7F8C8D",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 42, brand:"GMC",           model:"Sierra",      variant:"5.3 V8 SLT AT 4X4",             year:2021, price:699900,  monthly:11899, km:41800,  transmission:"Automático", fuel:"Gasolina", bodyType:"Pickup",   color:"#2C3E50",  image:img("pickup"),                        certified:true,  doors:4, seats:5 },

  // ── Great Wall ─────────────────────────────────────────────────────────────
  { id: 43, brand:"Great Wall",    model:"Ora 03",      variant:"400 STD RANGE",                 year:2024, price:429900,  monthly:7299,  km:4800,   transmission:"Automático", fuel:"Eléctrico", bodyType:"Sedan",   color:"#F9CA24",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 44, brand:"Great Wall",    model:"Haval H6",    variant:"2.0 TURBO ELITE 4WD DCT",       year:2023, price:449900,  monthly:7699,  km:8100,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Honda ──────────────────────────────────────────────────────────────────
  { id: 45, brand:"Honda",         model:"CR-V",        variant:"1.5 TURBO TOURING CVT",         year:2022, price:499900,  monthly:8499,  km:22300,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#BDC3C7",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 46, brand:"Honda",         model:"Civic",       variant:"1.5 SPORT PLUS CVT",            year:2023, price:389900,  monthly:6599,  km:6200,   transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#E74C3C",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 47, brand:"Honda",         model:"HR-V",        variant:"1.8 PRIME CVT",                 year:2022, price:369900,  monthly:6299,  km:18700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2980B9",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Hyundai ────────────────────────────────────────────────────────────────
  { id: 48, brand:"Hyundai",       model:"Tucson",      variant:"2.0 GLS AT FWD",                year:2021, price:349900,  monthly:5999,  km:44600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1ABC9C",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 49, brand:"Hyundai",       model:"Elantra",     variant:"2.0 GLS AT",                    year:2022, price:279900,  monthly:4799,  km:24100,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#2ECC71",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Infiniti ───────────────────────────────────────────────────────────────
  { id: 50, brand:"Infiniti",      model:"QX50",        variant:"2.0 TURBO SENSORY AWD CVT",     year:2022, price:699900,  monthly:11899, km:27300,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 51, brand:"Infiniti",      model:"Q50",         variant:"2.0 TURBO LUXE AT AWD",         year:2021, price:599900,  monthly:10099, km:39400,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#2C3E50",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── JAC ────────────────────────────────────────────────────────────────────
  { id: 52, brand:"Jac",           model:"JS4",         variant:"1.5 TURBO LUXURY CVT",          year:2023, price:299900,  monthly:5099,  km:11200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 53, brand:"Jac",           model:"S3",          variant:"1.5 LUXURY MT",                 year:2022, price:229900,  monthly:3999,  km:33400,  transmission:"Manual",     fuel:"Gasolina", bodyType:"SUV",      color:"#3498DB",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Jaecoo ─────────────────────────────────────────────────────────────────
  { id: 54, brand:"Jaecoo",        model:"J7",          variant:"1.6 TURBO LUXURY CVT 4WD",      year:2024, price:419900,  monthly:7199,  km:3500,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 55, brand:"Jaecoo",        model:"J8",          variant:"2.0 TURBO ELITE 4WD CVT",       year:2024, price:489900,  monthly:8299,  km:2100,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#ECF0F1",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:7 },

  // ── Jaguar ─────────────────────────────────────────────────────────────────
  { id: 56, brand:"Jaguar",        model:"F-Pace",      variant:"2.0 R-DYNAMIC S AWD AT",        year:2022, price:949900,  monthly:15999, km:21800,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 57, brand:"Jaguar",        model:"XE",          variant:"2.0 R-DYNAMIC S AT RWD",        year:2021, price:749900,  monthly:12699, km:38200,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#C0392B",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },

  // ── Jeep ───────────────────────────────────────────────────────────────────
  { id: 58, brand:"Jeep",          model:"Compass",     variant:"2.4 LATITUDE AT FWD",           year:2022, price:419900,  monthly:7099,  km:26900,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#16A085",  image:img("suv"),     badge:"Más vendido",  certified:true,  doors:4, seats:5 },
  { id: 59, brand:"Jeep",          model:"Grand Cherokee","variant":"3.6 V6 LIMITED 4X4 AT",    year:2021, price:649900,  monthly:10999, km:41200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Jetour ─────────────────────────────────────────────────────────────────
  { id: 60, brand:"Jetour",        model:"X70 Plus",    variant:"1.6 TURBO LUXURY CVT 4WD",      year:2023, price:349900,  monthly:5999,  km:9600,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#3498DB",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:7 },
  { id: 61, brand:"Jetour",        model:"Dashing",     variant:"1.5 TURBO ELITE CVT",           year:2024, price:389900,  monthly:6699,  km:2800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── JMC ────────────────────────────────────────────────────────────────────
  { id: 62, brand:"Jmc",           model:"Vigus Pro",   variant:"2.0 TURBO DIESEL 4X4 AT",       year:2023, price:489900,  monthly:8299,  km:14200,  transmission:"Automático", fuel:"Gasolina", bodyType:"Pickup",   color:"#1A1A1A",  image:img("pickup"),  badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 63, brand:"Jmc",           model:"N900",        variant:"2.4 LUXURY AT",                 year:2022, price:369900,  monthly:6299,  km:28700,  transmission:"Automático", fuel:"Gasolina", bodyType:"Minivan",  color:"#7F8C8D",  image:img("minivan"),                       certified:true,  doors:4, seats:9 },

  // ── Kia ────────────────────────────────────────────────────────────────────
  { id: 64, brand:"Kia",           model:"Sportage",    variant:"2.0 EX AT FWD",                 year:2022, price:369900,  monthly:6299,  km:31200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#7F8C8D",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 65, brand:"Kia",           model:"Soul",        variant:"2.0 EX AT",                     year:2020, price:249900,  monthly:4299,  km:55800,  transmission:"Automático", fuel:"Gasolina", bodyType:"Hatchback", color:"#27AE60", image:img("hatchback"),                     certified:false, doors:4, seats:5 },
  { id: 66, brand:"Kia",           model:"Sorento",     variant:"2.5 SX TURBO AWD AT",           year:2022, price:549900,  monthly:9299,  km:22100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:7 },

  // ── Land Rover ─────────────────────────────────────────────────────────────
  { id: 67, brand:"Land Rover",    model:"Discovery Sport","variant":"2.0 P250 S AWD AT",       year:2022, price:949900,  monthly:15999, km:19400,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#D5D5D5",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 68, brand:"Land Rover",    model:"Range Rover Evoque","variant":"2.0 P250 R-DYNAMIC SE AT",year:2023,price:1199900,monthly:19999, km:7200,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Lexus ──────────────────────────────────────────────────────────────────
  { id: 69, brand:"Lexus",         model:"NX",          variant:"350H AWD F SPORT",              year:2022, price:799900,  monthly:13499, km:17800,  transmission:"Automático", fuel:"Híbrido",  bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 70, brand:"Lexus",         model:"UX",          variant:"250H F SPORT FWD",              year:2021, price:629900,  monthly:10699, km:34100,  transmission:"Automático", fuel:"Híbrido",  bodyType:"SUV",      color:"#FFFFFF",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Lincoln ────────────────────────────────────────────────────────────────
  { id: 71, brand:"Lincoln",       model:"Nautilus",    variant:"2.0 TURBO SELECT AWD AT",       year:2022, price:749900,  monthly:12699, km:24500,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 72, brand:"Lincoln",       model:"Corsair",     variant:"2.0 TURBO RESERVE FWD AT",      year:2021, price:649900,  monthly:10999, km:38900,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#BDC3C7",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Mazda ──────────────────────────────────────────────────────────────────
  { id: 73, brand:"Mazda",         model:"CX-5",        variant:"2.5 GRAND TOURING AT",          year:2023, price:469900,  monthly:7899,  km:8700,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#8E0000",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 74, brand:"Mazda",         model:"3",           variant:"2.0 S AT",                      year:2021, price:289900,  monthly:4899,  km:38500,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#2C3E50",  image:img("sedan"),                         certified:true,  doors:4, seats:5 },
  { id: 75, brand:"Mazda",         model:"CX-30",       variant:"2.0 I GRAND TOURING AT",        year:2022, price:399900,  monthly:6799,  km:19200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0392B",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Mercedes-Benz ──────────────────────────────────────────────────────────
  { id: 76, brand:"Mercedes Benz", model:"GLC 300",     variant:"2.0 TURBO 4MATIC AT",           year:2022, price:979900,  monthly:16499, km:18200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#FFFFFF",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 77, brand:"Mercedes Benz", model:"C 200",       variant:"1.5 TURBO AVANTGARDE AT",       year:2023, price:849900,  monthly:14299, km:7100,   transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#1A1A1A",  image:img("sedan"),   badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 78, brand:"Mercedes Benz", model:"GLA 200",     variant:"1.3 TURBO PROGRESSIVE AT",      year:2021, price:699900,  monthly:11899, km:36800,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0C0C0",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── MG ─────────────────────────────────────────────────────────────────────
  { id: 79, brand:"Mg",            model:"ZS",          variant:"1.5 LUXURY CVT",                year:2023, price:319900,  monthly:5499,  km:5500,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E67E22",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 80, brand:"Mg",            model:"ZS EV",       variant:"PLUS",                          year:2023, price:449900,  monthly:7699,  km:8900,   transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#3498DB",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── MINI ───────────────────────────────────────────────────────────────────
  { id: 81, brand:"Mini",          model:"Cooper",      variant:"1.5 TURBO ESSENTIAL 3P AT",     year:2022, price:449900,  monthly:7699,  km:22400,  transmission:"Automático", fuel:"Gasolina", bodyType:"Hatchback", color:"#E74C3C", image:img("hatchback"),badge:"Destacado",   certified:true,  doors:3, seats:4 },
  { id: 82, brand:"Mini",          model:"Countryman",  variant:"2.0 TURBO COOPER S ALL4 AT",    year:2021, price:549900,  monthly:9299,  km:38100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#F5F5F5",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Mitsubishi ─────────────────────────────────────────────────────────────
  { id: 83, brand:"Mitsubishi",    model:"Outlander",   variant:"2.4 SE CVT FWD",                year:2020, price:339900,  monthly:5799,  km:48200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#8E44AD",  image:img("suv"),                           certified:false, doors:4, seats:7 },
  { id: 84, brand:"Mitsubishi",    model:"Eclipse Cross","variant":"1.5 TURBO HPE-S AT",         year:2022, price:399900,  monthly:6799,  km:28600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0392B",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Nissan ─────────────────────────────────────────────────────────────────
  { id: 85, brand:"Nissan",        model:"Versa",       variant:"1.6 ADVANCE CVT",               year:2023, price:249900,  monthly:4199,  km:12500,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#2980B9",  image:img("sedan"),   badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 86, brand:"Nissan",        model:"Kicks",       variant:"1.6 EXCLUSIVE XTRONIC",         year:2022, price:299900,  monthly:5099,  km:35200,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#F39C12",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 87, brand:"Nissan",        model:"Frontier",    variant:"2.5 PRO-4X MT 4X4",             year:2022, price:499900,  monthly:8499,  km:29800,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Pickup",   color:"#1A1A1A",  image:img("pickup"),  badge:"Más vendido",  certified:true,  doors:4, seats:5 },

  // ── Omoda ──────────────────────────────────────────────────────────────────
  { id: 88, brand:"Omoda",         model:"C5",          variant:"1.6 TURBO ELITE CVT",           year:2024, price:349900,  monthly:5999,  km:2800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 89, brand:"Omoda",         model:"E5",          variant:"430 SPORT",                     year:2024, price:479900,  monthly:8199,  km:1200,   transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#2980B9",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Peugeot ────────────────────────────────────────────────────────────────
  { id: 90, brand:"Peugeot",       model:"3008",        variant:"1.6 TURBO GT LINE EAT8",        year:2022, price:479900,  monthly:8199,  km:27400,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 91, brand:"Peugeot",       model:"2008",        variant:"1.2 TURBO ALLURE EAT8",         year:2023, price:379900,  monthly:6499,  km:9100,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Porsche ────────────────────────────────────────────────────────────────
  { id: 92, brand:"Porsche",       model:"Macan",       variant:"2.0 TURBO PDK AWD",             year:2022, price:1199900, monthly:19999, km:18700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 93, brand:"Porsche",       model:"Cayenne",     variant:"3.0 V6 TIPTRONIC S AWD",        year:2021, price:1499900, monthly:24999, km:32100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#FFFFFF",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── RAM ────────────────────────────────────────────────────────────────────
  { id: 94, brand:"Ram",           model:"1500",        variant:"5.7 V8 LARAMIE AT 4X4",         year:2022, price:849900,  monthly:14299, km:26700,  transmission:"Automático", fuel:"Gasolina", bodyType:"Pickup",   color:"#C0392B",  image:img("pickup"),  badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 95, brand:"Ram",           model:"700",         variant:"3.0 LARAMIE AT",                year:2021, price:449900,  monthly:7699,  km:41800,  transmission:"Automático", fuel:"Gasolina", bodyType:"Pickup",   color:"#2C3E50",  image:img("pickup"),                        certified:true,  doors:4, seats:5 },

  // ── Renault ────────────────────────────────────────────────────────────────
  { id: 96, brand:"Renault",       model:"Duster",      variant:"1.3 TURBO INTENS CVT",          year:2022, price:299900,  monthly:5199,  km:27600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#D35400",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 97, brand:"Renault",       model:"Koleos",      variant:"2.5 ICONIC CVT AWD",            year:2022, price:419900,  monthly:7199,  km:31400,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── SEAT ───────────────────────────────────────────────────────────────────
  { id: 98, brand:"Seat",          model:"Ibiza",       variant:"1.0 TSI FR MT",                 year:2022, price:259900,  monthly:4499,  km:21300,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Hatchback", color:"#F39C12", image:img("hatchback"),                     certified:true,  doors:5, seats:5 },
  { id: 99, brand:"Seat",          model:"Ateca",       variant:"1.4 TSI XCELLENCE DSG",         year:2021, price:389900,  monthly:6699,  km:33700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2980B9",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Smart ──────────────────────────────────────────────────────────────────
  { id: 100, brand:"Smart",        model:"#1",          variant:"PREMIUM 272HP",                 year:2024, price:549900,  monthly:9399,  km:2100,   transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#2ECC71",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 101, brand:"Smart",        model:"#3",          variant:"BRABUS 428HP",                  year:2024, price:649900,  monthly:10999, km:1800,   transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#C0392B",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Subaru ─────────────────────────────────────────────────────────────────
  { id: 102, brand:"Subaru",       model:"Outback",     variant:"2.5 LIMITED EYESIGHT CVT AWD",  year:2022, price:579900,  monthly:9799,  km:23100,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1ABC9C",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
  { id: 103, brand:"Subaru",       model:"Forester",    variant:"2.5 LIMITED EYESIGHT CVT AWD",  year:2021, price:499900,  monthly:8499,  km:38700,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#7F8C8D",  image:img("suv"),                           certified:true,  doors:4, seats:5 },

  // ── Suzuki ─────────────────────────────────────────────────────────────────
  { id: 104, brand:"Suzuki",       model:"Vitara",      variant:"1.4 BOOSTERJET GL AT",          year:2023, price:349900,  monthly:5999,  km:9800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#E74C3C",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },
  { id: 105, brand:"Suzuki",       model:"Swift",       variant:"1.2 GL MT",                     year:2022, price:199900,  monthly:3499,  km:26400,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Hatchback", color:"#F39C12", image:img("hatchback"),                     certified:true,  doors:5, seats:5 },

  // ── Tesla ──────────────────────────────────────────────────────────────────
  { id: 106, brand:"Tesla",        model:"Model 3",     variant:"STANDARD RANGE RWD",            year:2023, price:749900,  monthly:12699, km:11200,  transmission:"Automático", fuel:"Eléctrico", bodyType:"Sedan",   color:"#FFFFFF",  image:img("sedan"),   badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 107, brand:"Tesla",        model:"Model Y",     variant:"LONG RANGE AWD",                year:2022, price:849900,  monthly:14299, km:19800,  transmission:"Automático", fuel:"Eléctrico", bodyType:"SUV",     color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },

  // ── Toyota ─────────────────────────────────────────────────────────────────
  { id: 108, brand:"Toyota",       model:"Corolla",     variant:"1.8 LE CVT",                    year:2021, price:319900,  monthly:5399,  km:42100,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#FFFFFF",  image:img("sedan"),   badge:"Más vendido",  certified:true,  doors:4, seats:5 },
  { id: 109, brand:"Toyota",       model:"RAV4",        variant:"2.5 XLE AWD HYBRID",            year:2022, price:489900,  monthly:8299,  km:19800,  transmission:"Automático", fuel:"Híbrido",  bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 110, brand:"Toyota",       model:"Hilux",       variant:"2.8 SRV DIESEL MT 4X4",         year:2022, price:649900,  monthly:10999, km:38400,  transmission:"Manual",     fuel:"Gasolina", bodyType:"Pickup",   color:"#2C3E50",  image:img("pickup"),  badge:"Más vendido",  certified:true,  doors:4, seats:5 },

  // ── Volkswagen ─────────────────────────────────────────────────────────────
  { id: 111, brand:"Volkswagen",   model:"Jetta",       variant:"1.4 TSI COMFORTLINE DSG",       year:2021, price:299900,  monthly:5099,  km:29700,  transmission:"Automático", fuel:"Gasolina", bodyType:"Sedan",    color:"#3498DB",  image:img("sedan"),   badge:"Más vendido",  certified:true,  doors:4, seats:5 },
  { id: 112, brand:"Volkswagen",   model:"Tiguan",      variant:"1.4 TSI COMFORTLINE DSG",       year:2022, price:449900,  monthly:7599,  km:18500,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#ECF0F1",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 113, brand:"Volkswagen",   model:"Taos",        variant:"1.4 TSI TRENDLINE AT FWD",      year:2023, price:359900,  monthly:6199,  km:9800,   transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#C0392B",  image:img("suv"),     badge:"Nuevo ingreso",certified:true,  doors:4, seats:5 },

  // ── Volvo ──────────────────────────────────────────────────────────────────
  { id: 114, brand:"Volvo",        model:"XC60",        variant:"2.0 T5 INSCRIPTION AWD AT",     year:2022, price:899900,  monthly:15199, km:21600,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#1A1A1A",  image:img("suv"),     badge:"Destacado",    certified:true,  doors:4, seats:5 },
  { id: 115, brand:"Volvo",        model:"XC40",        variant:"2.0 T4 MOMENTUM FWD AT",        year:2021, price:699900,  monthly:11899, km:34800,  transmission:"Automático", fuel:"Gasolina", bodyType:"SUV",      color:"#2C3E50",  image:img("suv"),                           certified:true,  doors:4, seats:5 },
];
