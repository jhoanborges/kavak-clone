import Image from "next/image";

const carTypes = [
  { label: "Camioneta",    img: "/models/suv.png" },
  { label: "Doble Cabina", img: "/models/pickup.png" },
  { label: "Deportivo",    img: "/models/convertible.png" },
  { label: "SUV",          img: "/models/suv.png" },
  { label: "Sedan",        img: "/models/sedan.png" },
  { label: "Hatchback",    img: "/models/hatchback.png" },
  { label: "Pickup",       img: "/models/pickup.png" },
  { label: "Minivan",      img: "/models/minivan.png" },
  { label: "Coupe",        img: "/models/coupe.png" },
];

export default function CarTypes() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-foreground mb-6">Explora por tipo de auto</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
        {carTypes.map((type) => (
          <button
            key={type.label}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <div className="size-14 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src={type.img}
                alt={type.label}
                width={56}
                height={56}
                className="object-contain w-full h-full drop-shadow-sm"
              />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary font-medium transition-colors text-center leading-tight">
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
