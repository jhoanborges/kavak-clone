"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { NumericInput } from "@/components/ui/numeric-input";
import { cn } from "@/lib/utils";
import {
  AYUDA,
  CAMPO,
  CAMPO_SELECT,
  ETIQUETA,
} from "@/lib/form-styles";
import { pesos, pesosDecimal, type CotizacionResultado } from "@/lib/api/financiamiento";
import {
  consultaBuro,
  creaAutorizacionBuro,
  enviaPreestudio,
  generaCurp,
  generaRfc,
  getColonias,
  getColoniasPorCp,
  getEstados,
  getMunicipios,
  listaDocumentos,
  type Colonia,
  type Estado,
  type Municipio,
  type ResultadoPreestudio,
  type TipoDocumento,
} from "@/lib/api/preestudio-client";

type VehiculoFlow = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  color: string;
};

type Props = {
  valorAuto: number;
  enganche: number;
  plazo: number;
  resultado: CotizacionResultado;
  vehiculo: VehiculoFlow;
  /** Acción al terminar el paso 5 (opcional). */
  onFinish?: () => void;
};

const PASOS = [
  "Financiamiento",
  "Info. personal",
  "Info. laboral",
  "Buró",
  "Documentación",
] as const;

const GENEROS = [
  { v: "H", t: "Masculino" },
  { v: "M", t: "Femenino" },
];
const GRADOS = ["Primaria", "Secundaria", "Preparatoria", "Licenciatura", "Posgrado"];
const ESTADO_CIVIL = ["Soltero(a)", "Casado(a)", "Unión libre", "Divorciado(a)", "Viudo(a)"];
const VIVIENDA = ["Propia", "Rentada", "Familiar", "Hipotecada"];
const SECTORES = ["Empleado", "Independiente", "Empresario", "Jubilado", "Otro"];

/** Convierte "yyyy-mm-dd" a partes numéricas. */
function partesFecha(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return { anio: a || 0, mes: m || 0, dia: d || 0 };
}

/**
 * Embudo de financiamiento en 5 pasos (rediseño del original de Value).
 * Wired al webservice pre-estudio: catálogos encadenados, RFC/CURP, envío de
 * PROSPECTO en el paso 3, consulta de buró y documentos. Muestra los errores
 * que devuelve la API (incluida la razón de rechazo del prospecto).
 *
 * Vive INLINE en la página compartible /vehiculos/[slug]/financiamiento, no en
 * un modal: así el flujo es una URL con GET, indexable y compartible.
 */
export function FinanciamientoStepper({
  valorAuto,
  enganche,
  plazo,
  resultado,
  vehiculo,
  onFinish,
}: Props) {
  const [paso, setPaso] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [cargando, setCargando] = React.useState(false);
  const [rfcLoading, setRfcLoading] = React.useState(false);
  const [curpLoading, setCurpLoading] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  // Cuando aparece un error, trae el banner a la vista.
  React.useEffect(() => {
    if (error) bodyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [error]);

  // Catálogos
  const [estados, setEstados] = React.useState<Estado[]>([]);
  const [municipios, setMunicipios] = React.useState<Municipio[]>([]);
  const [colonias, setColonias] = React.useState<Colonia[]>([]);

  // Datos por paso
  const [per, setPer] = React.useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    correo: "",
    genero: "",
    fecha_nacimiento: "",
    rfc: "",
    curp: "",
    grado: "",
    estado_civil: "",
    clave_estado_nac: "",
  });
  const [res, setRes] = React.useState({
    calle: "",
    num_ext: "",
    num_int: "",
    cp: "",
    vivienda: "",
    clave_estado: "",
    clave_municipio: "",
    clave_colonia: "",
  });
  const [lab, setLab] = React.useState({
    nombre_empresa: "",
    anios: "",
    sector: "",
  });
  const [sueldo, setSueldo] = React.useState<number | undefined>();
  const [otros, setOtros] = React.useState<number | undefined>();
  const [gBasicos, setGBasicos] = React.useState<number | undefined>();
  const [gVivienda, setGVivienda] = React.useState<number | undefined>();
  const [gRecrea, setGRecrea] = React.useState<number | undefined>();

  const [preestudio, setPreestudio] = React.useState<ResultadoPreestudio | null>(null);
  const [buro, setBuro] = React.useState<string | null>(null);
  const [docs, setDocs] = React.useState<TipoDocumento[]>([]);

  const setP = (k: keyof typeof per, v: string) => setPer((s) => ({ ...s, [k]: v }));
  const setR = (k: keyof typeof res, v: string) => setRes((s) => ({ ...s, [k]: v }));
  const setL = (k: keyof typeof lab, v: string) => setLab((s) => ({ ...s, [k]: v }));

  // Carga inicial de estados (país fijo MEXICO = 1).
  React.useEffect(() => {
    if (!open) return;
    getEstados(1).then(setEstados).catch(() => setEstados([]));
  }, [open]);

  // Estado -> municipios.
  React.useEffect(() => {
    const ce = Number(res.clave_estado);
    if (!ce) return;
    getMunicipios(1, ce).then(setMunicipios).catch(() => setMunicipios([]));
  }, [res.clave_estado]);

  // Municipio -> colonias.
  React.useEffect(() => {
    const cm = Number(res.clave_municipio);
    if (!cm) return;
    getColonias(1, Number(res.clave_estado), cm).then(setColonias).catch(() => setColonias([]));
  }, [res.clave_municipio, res.clave_estado]);

  async function buscarPorCp() {
    if (!res.cp) return;
    setError(null);
    try {
      const cols = await getColoniasPorCp(res.cp);
      if (cols.length === 0) {
        setError("No se encontraron colonias para ese C.P.");
        return;
      }
      const primera = cols[0];
      setRes((s) => ({
        ...s,
        clave_estado: String(primera.clave_estado),
        clave_municipio: String(primera.clave_municipio),
        clave_colonia: "",
      }));
      setColonias(cols);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al buscar el C.P.");
    }
  }

  async function generarRfc() {
    setError(null);
    const { anio, mes, dia } = partesFecha(per.fecha_nacimiento);
    if (!per.primer_nombre || !per.apellido_paterno || !anio) {
      setError("Para generar el RFC llena nombre, apellido paterno y fecha de nacimiento.");
      return;
    }
    setRfcLoading(true);
    try {
      const rfc = await generaRfc({
        nombre_completo: per.primer_nombre,
        apellido_paterno: per.apellido_paterno,
        apellido_materno: per.apellido_materno,
        fecha_nacimiento_anio: anio,
        fecha_nacimiento_mes: mes,
        fecha_nacimiento_dia: dia,
      });
      setP("rfc", rfc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el RFC.");
    } finally {
      setRfcLoading(false);
    }
  }

  async function generarCurp() {
    setError(null);
    const { anio, mes, dia } = partesFecha(per.fecha_nacimiento);
    const est = estados.find((e) => e.clave_estado === Number(per.clave_estado_nac));
    if (!per.genero || !est || !anio || !per.primer_nombre || !per.apellido_paterno) {
      setError("Para generar la CURP llena nombre, apellidos, género, fecha y estado de nacimiento.");
      return;
    }
    setCurpLoading(true);
    try {
      const curp = await generaCurp({
        genero: per.genero as "H" | "M",
        nombre_completo: per.primer_nombre,
        apellido_paterno: per.apellido_paterno,
        apellido_materno: per.apellido_materno,
        fecha_nacimiento_anio: anio,
        fecha_nacimiento_mes: mes,
        fecha_nacimiento_dia: dia,
        clave_entidad_estado: est.clave_entidad_para_curp,
      });
      setP("curp", curp);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar la CURP.");
    } finally {
      setCurpLoading(false);
    }
  }

  async function enviarProspecto() {
    setError(null);
    setCargando(true);
    try {
      const est = estados.find((e) => e.clave_estado === Number(res.clave_estado));
      const mun = municipios.find((m) => m.clave_municipio === Number(res.clave_municipio));
      const col = colonias.find((c) => c.clave_colonia === Number(res.clave_colonia));
      const [a, m, d] = per.fecha_nacimiento.split("-");

      const payload = {
        tipo_persona: 1,
        tipo_personalidad: 1,
        folio_amortizacion: 0,
        id_partida: Number(vehiculo.id) || 0,
        folio_bien: 0,
        prospecto: {
          primer_nombre: per.primer_nombre,
          segundo_nombre: per.segundo_nombre,
          apellido_paterno: per.apellido_paterno,
          apellido_materno: per.apellido_materno,
          fecha_nacimiento: a && m && d ? `${d}/${m}/${a}` : "",
          correo_electronico: per.correo,
          telefono: per.telefono,
          rfc: per.rfc,
          curp: per.curp,
          situacion: per.estado_civil,
          genero: per.genero === "H" ? "M" : "F",
        },
        residencia: {
          clave_pais: 1,
          pais: "MEXICO",
          clave_estado: Number(res.clave_estado),
          estado: est?.estado ?? "",
          clave_municipio: Number(res.clave_municipio),
          municipio: mun?.municipio ?? "",
          clave_colonia: Number(res.clave_colonia),
          colonia: col?.colonia ?? "",
          calle: res.calle,
          cp: res.cp,
          num_int: res.num_int,
          num_ext: res.num_ext,
          vivienda: res.vivienda,
        },
        trabajo: {
          tipo_trabajo: lab.sector,
          nombre_empresa: lab.nombre_empresa,
          ingreso_mensual: (sueldo ?? 0) + (otros ?? 0),
          egreso_mensual: (gBasicos ?? 0) + (gVivienda ?? 0) + (gRecrea ?? 0),
          grado_profesion: per.grado,
          anios_antiguedad: Number(lab.anios) || 0,
        },
        vehiculo: {
          anio: String(vehiculo.anio ?? ""),
          clave_marca: 0,
          marca: vehiculo.marca,
          clave_modelo: 0,
          modelo: vehiculo.modelo,
          clave_color: 0,
          color: vehiculo.color,
        },
      };

      const r = await enviaPreestudio(payload);
      // Rechazo de negocio: Status 1 pero Resultado_Prospecto 0 con motivo.
      if (r.Resultado_Prospecto !== 1) {
        setError(r.Mensaje_Prospecto || "El prospecto no fue aprobado.");
        return;
      }
      setPreestudio(r);
      setPaso(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar el pre-estudio.");
    } finally {
      setCargando(false);
    }
  }

  async function consultarBuro() {
    if (!preestudio) return;
    setError(null);
    setCargando(true);
    try {
      const folio = await creaAutorizacionBuro(preestudio.Clave_Prospecto);
      const r = await consultaBuro({
        clave_preestudio: preestudio.Clave_Preestudio,
        clave_prospecto_persona: preestudio.Clave_Prospecto,
        folio_autorizacion: folio,
      });
      setBuro(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo consultar el buró.");
    } finally {
      setCargando(false);
    }
  }

  React.useEffect(() => {
    if (paso === 5 && docs.length === 0) {
      listaDocumentos().then(setDocs).catch(() => setDocs([]));
    }
  }, [paso, docs.length]);

  function siguiente() {
    setError(null);
    if (paso === 3) {
      enviarProspecto();
      return;
    }
    setPaso((p) => Math.min(p + 1, PASOS.length));
  }

  const financiado = Math.max(valorAuto - enganche, 0);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
        {/* Cabecera + stepper */}
        <div className="border-b border-border bg-muted/40 px-6 py-4">
          <h2 className="font-heading text-h4 font-medium">Solicitud de crédito</h2>
          <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {PASOS.map((label, i) => {
              const n = i + 1;
              const activo = n === paso;
              const hecho = n < paso;
              return (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-caption font-semibold tabular-nums",
                      activo && "bg-primary text-primary-foreground",
                      hecho && "bg-primary/15 text-primary",
                      !activo && !hecho && "bg-muted text-ink-600"
                    )}
                  >
                    {hecho ? <Check className="size-3.5" /> : n}
                  </span>
                  <span
                    className={cn(
                      "text-caption",
                      activo ? "font-semibold text-foreground" : "text-ink-600"
                    )}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Cuerpo */}
        <div ref={bodyRef} className="p-6">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-2 text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {paso === 1 && (
            <PasoFinanciamiento
              valorAuto={valorAuto}
              enganche={enganche}
              financiado={financiado}
              plazo={plazo}
              resultado={resultado}
            />
          )}

          {paso === 2 && (
            <PasoPersonal
              per={per}
              setP={setP}
              res={res}
              setR={setR}
              estados={estados}
              municipios={municipios}
              colonias={colonias}
              onBuscarCp={buscarPorCp}
              onRfc={generarRfc}
              onCurp={generarCurp}
              rfcLoading={rfcLoading}
              curpLoading={curpLoading}
            />
          )}

          {paso === 3 && (
            <PasoLaboral
              lab={lab}
              setL={setL}
              sueldo={sueldo}
              setSueldo={setSueldo}
              otros={otros}
              setOtros={setOtros}
              gBasicos={gBasicos}
              setGBasicos={setGBasicos}
              gVivienda={gVivienda}
              setGVivienda={setGVivienda}
              gRecrea={gRecrea}
              setGRecrea={setGRecrea}
            />
          )}

          {paso === 4 && (
            <PasoBuro buro={buro} cargando={cargando} onConsultar={consultarBuro} />
          )}

          {paso === 5 && <PasoDocumentos docs={docs} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <Button
            variant="outline"
            size="cta"
            onClick={() => setPaso((p) => Math.max(p - 1, 1))}
            disabled={paso === 1 || cargando}
            className={paso === 1 ? "invisible" : ""}
          >
            Atrás
          </Button>
          {paso < PASOS.length ? (
            <Button variant="petrol" size="cta" onClick={siguiente} disabled={cargando}>
              {cargando && <Loader2 className="animate-spin" data-icon="inline-start" />}
              Siguiente
            </Button>
          ) : (
            <Button variant="petrol" size="cta" onClick={onFinish}>
              Finalizar
            </Button>
          )}
        </div>
    </div>
  );
}

/* ── Campos reutilizables ──────────────────────────────────────────────────── */

/** Subtítulo de sección con línea separadora al lado. */
function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-4 w-1 rounded-full bg-primary" />
      <h3 className="font-heading text-body-1 font-semibold whitespace-nowrap">
        {children}
      </h3>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Campo({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={ETIQUETA}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
      {hint && <span className={AYUDA}>{hint}</span>}
    </label>
  );
}

function Texto(props: React.ComponentProps<"input">) {
  return <input {...props} className={cn(CAMPO, "w-full rounded-lg border border-input", props.className)} />;
}

function Sel({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select className={CAMPO_SELECT} value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}

function Dinero({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body-2 text-ink-600">
        $
      </span>
      <NumericInput className={cn(CAMPO, "w-full pl-8")} value={value} onValueChange={onChange} />
    </div>
  );
}

/* ── Paso 1: resumen ───────────────────────────────────────────────────────── */

function PasoFinanciamiento({
  valorAuto,
  enganche,
  financiado,
  plazo,
  resultado,
}: {
  valorAuto: number;
  enganche: number;
  financiado: number;
  plazo: number;
  resultado: CotizacionResultado;
}) {
  const filas: Array<[string, string]> = [
    ["Valor del auto", pesos(valorAuto)],
    ["Enganche", pesos(enganche)],
    ["Monto financiado", pesos(financiado)],
    ["Plazo", `${plazo} meses`],
  ];
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-heading text-h4 font-medium">Detalle de financiamiento</h3>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <dl className="rounded-xl border border-border p-5">
          {filas.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0"
            >
              <dt className="text-body-2 text-ink-600">{k}</dt>
              <dd className="font-label text-body-2 font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-brand-aqua/10 p-6 text-center sm:w-64">
          <p className="text-caption text-ink-600">Mensualidad</p>
          <p className="my-1 font-heading text-h2 font-bold tabular-nums text-primary">
            {pesosDecimal(resultado.pagoMensual)}
          </p>
          <p className="text-caption text-ink-600">a {plazo} meses</p>
          {resultado.totalAPagar != null && (
            <p className="mt-3 border-t border-primary/20 pt-3 text-caption text-ink-600">
              Total a pagar
              <span className="mt-0.5 block font-label text-body-1 font-semibold text-foreground tabular-nums">
                {pesos(resultado.totalAPagar)}
              </span>
            </p>
          )}
        </div>
      </div>
      <p className={AYUDA}>
        *La cotización no contempla el costo del seguro, que se cotiza al cerrar
        el contrato y se agrega a la mensualidad.
      </p>
    </div>
  );
}

/* ── Paso 2: personal + residencia ─────────────────────────────────────────── */

function PasoPersonal({
  per,
  setP,
  res,
  setR,
  estados,
  municipios,
  colonias,
  onBuscarCp,
  onRfc,
  onCurp,
  rfcLoading,
  curpLoading,
}: {
  per: Record<string, string>;
  setP: (k: never, v: string) => void;
  res: Record<string, string>;
  setR: (k: never, v: string) => void;
  estados: Estado[];
  municipios: Municipio[];
  colonias: Colonia[];
  onBuscarCp: () => void;
  onRfc: () => void;
  onCurp: () => void;
  rfcLoading: boolean;
  curpLoading: boolean;
}) {
  const set = setP as (k: string, v: string) => void;
  const setr = setR as (k: string, v: string) => void;
  return (
    <div className="flex flex-col gap-6">
      <section>
        <SubHeader>Datos personales</SubHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre" required>
            <Texto value={per.primer_nombre} onChange={(e) => set("primer_nombre", e.target.value)} />
          </Campo>
          <Campo label="Segundo nombre">
            <Texto value={per.segundo_nombre} onChange={(e) => set("segundo_nombre", e.target.value)} />
          </Campo>
          <Campo label="Apellido paterno" required>
            <Texto value={per.apellido_paterno} onChange={(e) => set("apellido_paterno", e.target.value)} />
          </Campo>
          <Campo label="Apellido materno" required>
            <Texto value={per.apellido_materno} onChange={(e) => set("apellido_materno", e.target.value)} />
          </Campo>
          <Campo label="Teléfono" required>
            <Texto inputMode="tel" value={per.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </Campo>
          <Campo label="Correo electrónico" required>
            <Texto type="email" value={per.correo} onChange={(e) => set("correo", e.target.value)} />
          </Campo>
          <Campo label="Género" required>
            <Sel value={per.genero} onChange={(v) => set("genero", v)}>
              <option value="">Elegir...</option>
              {GENEROS.map((g) => (
                <option key={g.v} value={g.v}>{g.t}</option>
              ))}
            </Sel>
          </Campo>
          <Campo label="Fecha de nacimiento" required>
            <Texto type="date" value={per.fecha_nacimiento} onChange={(e) => set("fecha_nacimiento", e.target.value)} />
          </Campo>
          <Campo label="Estado de nacimiento" required>
            <Sel value={per.clave_estado_nac} onChange={(v) => set("clave_estado_nac", v)}>
              <option value="">Elegir...</option>
              {estados.map((e) => (
                <option key={e.clave_estado} value={e.clave_estado}>{e.estado}</option>
              ))}
            </Sel>
          </Campo>
          <Campo label="RFC" required hint="Llena nombre, apellido y fecha, luego genera.">
            <div className="flex gap-2">
              <Texto value={per.rfc} onChange={(e) => set("rfc", e.target.value)} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRfc}
                disabled={rfcLoading}
                className="shrink-0"
              >
                {rfcLoading && <Loader2 className="animate-spin" data-icon="inline-start" />}
                Generar
              </Button>
            </div>
          </Campo>
          <Campo label="CURP" required hint="Requiere además género y estado de nacimiento.">
            <div className="flex gap-2">
              <Texto value={per.curp} onChange={(e) => set("curp", e.target.value)} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCurp}
                disabled={curpLoading}
                className="shrink-0"
              >
                {curpLoading && <Loader2 className="animate-spin" data-icon="inline-start" />}
                Generar
              </Button>
            </div>
          </Campo>
          <Campo label="Grado de estudios" required>
            <Sel value={per.grado} onChange={(v) => set("grado", v)}>
              <option value="">Elegir...</option>
              {GRADOS.map((g) => (<option key={g} value={g}>{g}</option>))}
            </Sel>
          </Campo>
          <Campo label="Estado civil" required>
            <Sel value={per.estado_civil} onChange={(v) => set("estado_civil", v)}>
              <option value="">Elegir...</option>
              {ESTADO_CIVIL.map((g) => (<option key={g} value={g}>{g}</option>))}
            </Sel>
          </Campo>
        </div>
      </section>

      <section>
        <SubHeader>Datos de residencia</SubHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Calle" required>
            <Texto value={res.calle} onChange={(e) => setr("calle", e.target.value)} />
          </Campo>
          <Campo label="Número exterior" required>
            <Texto value={res.num_ext} onChange={(e) => setr("num_ext", e.target.value)} />
          </Campo>
          <Campo label="Número interior">
            <Texto value={res.num_int} onChange={(e) => setr("num_int", e.target.value)} />
          </Campo>
          <Campo label="C.P." required hint="Busca para llenar estado, municipio y colonia.">
            <div className="flex gap-2">
              <Texto inputMode="numeric" value={res.cp} onChange={(e) => setr("cp", e.target.value)} />
              <Button type="button" variant="outline" size="sm" onClick={onBuscarCp}>Buscar</Button>
            </div>
          </Campo>
          <Campo label="Tipo de vivienda" required>
            <Sel value={res.vivienda} onChange={(v) => setr("vivienda", v)}>
              <option value="">Elegir...</option>
              {VIVIENDA.map((g) => (<option key={g} value={g}>{g}</option>))}
            </Sel>
          </Campo>
          <Campo label="Estado" required>
            <Sel value={res.clave_estado} onChange={(v) => setr("clave_estado", v)}>
              <option value="">Elegir...</option>
              {estados.map((e) => (
                <option key={e.clave_estado} value={e.clave_estado}>{e.estado}</option>
              ))}
            </Sel>
          </Campo>
          <Campo label="Municipio" required>
            <Sel value={res.clave_municipio} onChange={(v) => setr("clave_municipio", v)}>
              <option value="">Elegir...</option>
              {municipios.map((m) => (
                <option key={m.clave_municipio} value={m.clave_municipio}>{m.municipio}</option>
              ))}
            </Sel>
          </Campo>
          <Campo label="Colonia" required>
            <Sel value={res.clave_colonia} onChange={(v) => setr("clave_colonia", v)}>
              <option value="">Elegir...</option>
              {colonias.map((c) => (
                <option key={c.clave_colonia} value={c.clave_colonia}>{c.colonia}</option>
              ))}
            </Sel>
          </Campo>
        </div>
      </section>
    </div>
  );
}

/* ── Paso 3: laboral ───────────────────────────────────────────────────────── */

function PasoLaboral({
  lab,
  setL,
  sueldo,
  setSueldo,
  otros,
  setOtros,
  gBasicos,
  setGBasicos,
  gVivienda,
  setGVivienda,
  gRecrea,
  setGRecrea,
}: {
  lab: Record<string, string>;
  setL: (k: never, v: string) => void;
  sueldo: number | undefined;
  setSueldo: (v: number | undefined) => void;
  otros: number | undefined;
  setOtros: (v: number | undefined) => void;
  gBasicos: number | undefined;
  setGBasicos: (v: number | undefined) => void;
  gVivienda: number | undefined;
  setGVivienda: (v: number | undefined) => void;
  gRecrea: number | undefined;
  setGRecrea: (v: number | undefined) => void;
}) {
  const set = setL as (k: string, v: string) => void;
  return (
    <div className="flex flex-col gap-6">
      <section>
        <SubHeader>Datos de trabajo</SubHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Nombre de la empresa" required>
            <Texto value={lab.nombre_empresa} onChange={(e) => set("nombre_empresa", e.target.value)} />
          </Campo>
          <Campo label="Años laborando" required>
            <Texto inputMode="numeric" value={lab.anios} onChange={(e) => set("anios", e.target.value)} />
          </Campo>
          <Campo label="Sector laboral">
            <Sel value={lab.sector} onChange={(v) => set("sector", v)}>
              <option value="">Elegir...</option>
              {SECTORES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </Sel>
          </Campo>
        </div>
      </section>
      <section>
        <SubHeader>Ingresos</SubHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Sueldo" required>
            <Dinero value={sueldo} onChange={setSueldo} />
          </Campo>
          <Campo label="Otros">
            <Dinero value={otros} onChange={setOtros} />
          </Campo>
        </div>
      </section>
      <section>
        <SubHeader>Gastos</SubHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Básicos" required hint="Salud, gasolina, ropa, etc.">
            <Dinero value={gBasicos} onChange={setGBasicos} />
          </Campo>
          <Campo label="Vivienda" required hint="Agua, luz, teléfono, renta, etc.">
            <Dinero value={gVivienda} onChange={setGVivienda} />
          </Campo>
          <Campo label="Recreación y otros" required hint="Cenas, entretenimiento, cine, etc.">
            <Dinero value={gRecrea} onChange={setGRecrea} />
          </Campo>
        </div>
      </section>
    </div>
  );
}

/* ── Paso 4: buró ──────────────────────────────────────────────────────────── */

function PasoBuro({
  buro,
  cargando,
  onConsultar,
}: {
  buro: string | null;
  cargando: boolean;
  onConsultar: () => void;
}) {
  const aprobado = buro?.toUpperCase().includes("APROBADO") && !buro.toUpperCase().includes("NO APROBADO");
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="size-7" />
      </span>
      <div>
        <h3 className="font-heading text-h4 font-medium">Consulta de buró de crédito</h3>
        <p className="mx-auto mt-1 max-w-md text-body-2 text-ink-600">
          Autorizas la consulta de tu historial crediticio para completar el
          pre-estudio. No afecta tu score.
        </p>
      </div>

      {buro ? (
        <div
          className={cn(
            "rounded-xl border px-6 py-4 text-body-1 font-semibold",
            aprobado
              ? "border-primary/25 bg-primary/5 text-primary"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          {buro}
        </div>
      ) : (
        <Button variant="petrol" size="cta" onClick={onConsultar} disabled={cargando}>
          {cargando && <Loader2 className="animate-spin" data-icon="inline-start" />}
          Autorizar y consultar
        </Button>
      )}
    </div>
  );
}

/* ── Paso 5: documentación ─────────────────────────────────────────────────── */

function PasoDocumentos({ docs }: { docs: TipoDocumento[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-heading text-h4 font-medium">Documentación</h3>
        <p className="mt-1 text-body-2 text-ink-600">
          Sube los documentos requeridos para tu solicitud.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {docs.map((d) => (
          <li
            key={d.clave_tipo_documento}
            className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
          >
            <span className="text-body-2">{d.documento}</span>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                Subir
                <input type="file" className="hidden" accept="application/pdf,image/*" />
              </label>
            </Button>
          </li>
        ))}
        {docs.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-6 text-center text-body-2 text-ink-600">
            <Sparkles className="mx-auto mb-2 size-5 text-primary" />
            Carga de documentos disponible próximamente.
          </li>
        )}
      </ul>
    </div>
  );
}
