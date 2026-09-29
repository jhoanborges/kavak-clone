import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { NextResponse } from "next/server";

/**
 * Subida de imagenes de autos, para uso INTERNO (red interna, sin auth).
 *
 * Recibe multipart/form-data y escribe cada archivo en public/autos/<nombre>.
 * El cliente los consume luego como /autos/<nombre> (estatico) o via el proxy.
 *
 * Campos aceptados en el form-data:
 *   file  | files   -> uno o varios archivos (repetir el campo para varios).
 *
 * El nombre destino sale del filename del archivo; si el form manda un campo
 * `nombre` con UN solo archivo, ese pisa el filename. Se reduce a basename para
 * que nunca se escriba fuera de public/autos.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUT_DIR = join(process.cwd(), "public", "autos");

type Resultado = { nombre: string; bytes: number; estado: "ok" | "fail"; error?: string };

/** basename + limpia lo que no sea nombre de archivo plano. Sin barras ni "..". */
function nombreSeguro(entrada: string): string {
  return basename(entrada).replace(/[^A-Za-z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  const tipo = request.headers.get("content-type") ?? "";
  if (!tipo.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Usa multipart/form-data con el campo 'file' (o 'files')." },
      { status: 415 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "form-data ilegible." }, { status: 400 });
  }

  const archivos = [...form.getAll("file"), ...form.getAll("files")].filter(
    (v): v is File => v instanceof File
  );

  if (archivos.length === 0) {
    return NextResponse.json(
      { error: "No llego ningun archivo en 'file' ni 'files'." },
      { status: 400 }
    );
  }

  // Nombre explicito opcional: solo aplica cuando viene UN archivo.
  const nombreForzado =
    archivos.length === 1 && typeof form.get("nombre") === "string"
      ? String(form.get("nombre"))
      : null;

  await mkdir(OUT_DIR, { recursive: true });

  const resultados: Resultado[] = [];
  for (const archivo of archivos) {
    const nombre = nombreSeguro(nombreForzado ?? (archivo.name || "sin-nombre"));
    try {
      const buf = Buffer.from(await archivo.arrayBuffer());
      await writeFile(join(OUT_DIR, nombre), buf);
      resultados.push({ nombre, bytes: buf.length, estado: "ok" });
    } catch (e) {
      resultados.push({
        nombre,
        bytes: 0,
        estado: "fail",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const ok = resultados.filter((r) => r.estado === "ok").length;
  const fail = resultados.length - ok;

  return NextResponse.json(
    { ok, fail, total: resultados.length, archivos: resultados },
    { status: fail === 0 ? 201 : 207 }
  );
}
