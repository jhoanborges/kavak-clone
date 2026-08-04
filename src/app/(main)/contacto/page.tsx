"use client";

import { useFormik } from "formik";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Send, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/config";

// ── Zod schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  contact_name: z.string().min(2, "El nombre es requerido"),
  email_from: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(7, "Ingresa un número de teléfono válido"),
  partner_name: z.string().optional(),
  name: z.string().min(3, "El asunto es requerido"),
  description: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type FormValues = z.infer<typeof schema>;

// ── Formik → Zod bridge ─────────────────────────────────────────────────────
function validate(values: FormValues) {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Partial<Record<keyof FormValues, string>> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof FormValues;
    if (!errors[key]) errors[key] = issue.message;
  });
  return errors;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const infoItems = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "+52 800 123 4567",
    href: "tel:+528001234567",
  },
  {
    icon: Mail,
    label: "Correo",
    value: `contacto@${APP_NAME.toLowerCase()}.com.mx`,
    href: `mailto:contacto@${APP_NAME.toLowerCase()}.com.mx`,
  },
  {
    icon: MapPin,
    label: "Oficinas",
    value: "Ciudad de México, CDMX",
    href: "#",
  },
];

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  touched,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}) {
  const showError = touched && error;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {showError && (
        <p className="text-xs text-destructive leading-tight">{error}</p>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactoPage() {
  const formik = useFormik<FormValues>({
    initialValues: {
      contact_name: "",
      email_from: "",
      phone: "",
      partner_name: "",
      name: "",
      description: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch(`${API_URL}/api/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        toast.success("¡Mensaje enviado!", {
          description: "Nos pondremos en contacto contigo pronto.",
        });
        resetForm();
      } catch {
        toast.error("No pudimos enviar tu mensaje", {
          description: "Por favor intenta de nuevo o escríbenos directamente.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  const inputClass = (field: keyof FormValues) =>
    [
      "h-11 bg-white transition-colors",
      touched[field] && errors[field]
        ? "border-destructive focus-visible:ring-destructive/30"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <main className="min-h-[calc(100vh-56px)] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{
              backgroundColor: "color-mix(in oklch, var(--brand-primary) 12%, transparent)",
              color: "var(--brand-primary)",
            }}
          >
            Contáctanos
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            Llena el formulario y un asesor de {APP_NAME} se comunicará contigo
            a la brevedad posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── Info sidebar ── */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div
              className="rounded-2xl p-6 flex flex-col gap-6 text-white h-full"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Información de contacto</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Estamos disponibles de lunes a viernes de 9:00 a 18:00 hrs.
                </p>
              </div>

              <ul className="flex flex-col gap-5">
                {infoItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-start gap-3 group"
                    >
                      <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-white text-sm font-semibold group-hover:underline">
                          {value}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Decorative circles */}
              <div className="mt-auto relative h-24 overflow-hidden pointer-events-none">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-14 -right-2 w-24 h-24 rounded-full bg-white/5" />
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 flex flex-col gap-5"
            >
              {/* Row 1: name + company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Nombre completo"
                  required
                  error={errors.contact_name}
                  touched={touched.contact_name}
                >
                  <Input
                    id="contact_name"
                    name="contact_name"
                    placeholder="Ej. Roberto Mendoza"
                    autoComplete="name"
                    value={values.contact_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("contact_name")}
                  />
                </Field>

                <Field
                  label="Empresa"
                  error={errors.partner_name}
                  touched={touched.partner_name}
                >
                  <Input
                    id="partner_name"
                    name="partner_name"
                    placeholder="Nombre de tu empresa"
                    autoComplete="organization"
                    value={values.partner_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("partner_name")}
                  />
                </Field>
              </div>

              {/* Row 2: email + phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Correo electrónico"
                  required
                  error={errors.email_from}
                  touched={touched.email_from}
                >
                  <Input
                    id="email_from"
                    name="email_from"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    value={values.email_from}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("email_from")}
                  />
                </Field>

                <Field
                  label="Teléfono"
                  required
                  error={errors.phone}
                  touched={touched.phone}
                >
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass("phone")}
                  />
                </Field>
              </div>

              {/* Asunto */}
              <Field
                label="Asunto"
                required
                error={errors.name}
                touched={touched.name}
              >
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej. Cotización flotilla 10 unidades"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("name")}
                />
              </Field>

              {/* Mensaje */}
              <Field
                label="Mensaje"
                required
                error={errors.description}
                touched={touched.description}
              >
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors",
                    touched.description && errors.description
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-input",
                  ].join(" ")}
                />
              </Field>

              {/* Required note + submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <p className="text-xs text-muted-foreground">
                  Los campos con <span className="text-destructive">*</span> son obligatorios.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer self-stretch sm:self-auto gap-2 min-w-36"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar mensaje
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
