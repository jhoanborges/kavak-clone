"use client";

import { cloneElement, isValidElement, useId } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Send, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/config";
import {
  CAMPO,
  CAMPO_ERROR,
  CAMPO_STACK,
  CAMPO_TEXTAREA,
  ERROR,
  ETIQUETA,
} from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import {
  obtenerTokenRecaptcha,
  verificarRecaptcha,
  RECAPTCHA_ACCIONES,
} from "@/lib/recaptcha";

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
/**
 * Etiqueta el control con `htmlFor` + `id` inyectado al hijo. Asociación
 * EXPLÍCITA, no implícita: además de anunciar la etiqueta, hace que pulsar
 * sobre ella enfoque el campo, y enlaza el mensaje de error vía
 * `aria-describedby` para que el lector de pantalla lo lea al entrar al campo.
 */
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
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const showError = Boolean(touched && error);

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": showError || undefined,
        "aria-describedby": showError ? errorId : undefined,
      } as React.InputHTMLAttributes<HTMLInputElement>)
    : children;

  return (
    <div className={CAMPO_STACK}>
      <label htmlFor={id} className={ETIQUETA}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {control}
      {showError && (
        <p id={errorId} className={ERROR}>
          {error}
        </p>
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
        // reCAPTCHA antes del POST. Con el interruptor apagado el token es
        // null y el servidor responde `omitido`, así que no bloquea el envío.
        const token = await obtenerTokenRecaptcha(RECAPTCHA_ACCIONES.contacto);
        const check = await verificarRecaptcha(token, RECAPTCHA_ACCIONES.contacto);
        if (!check.ok) {
          toast.error("No pudimos verificar tu envío", {
            description: check.error,
          });
          setSubmitting(false);
          return;
        }

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
    cn(CAMPO, touched[field] && errors[field] && CAMPO_ERROR);

  return (
    <main className="min-h-[calc(100vh-56px)] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="mb-4 inline-block rounded-4xl bg-brand-aqua/30 px-3 py-1 font-label text-overline uppercase text-brand-petrol">
            Contáctanos
          </span>
          <h1 className="mb-3 font-heading text-h1 font-light text-foreground">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="mx-auto max-w-md text-body-2 text-ink-800">
            Llena el formulario y un asesor de {APP_NAME} se comunicará contigo
            a la brevedad posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* ── Info sidebar ── */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex h-full flex-col gap-6 rounded-xl bg-brand-petrol p-6 text-white">
              <div>
                <h2 className="mb-1 font-heading text-h3 font-medium">Información de contacto</h2>
                <p className="text-body-2 leading-relaxed text-white/80">
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
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 md:p-8"
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
                  className={cn(
                    CAMPO_TEXTAREA,
                    touched.description && errors.description && CAMPO_ERROR
                  )}
                />
              </Field>

              {/* Required note + submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <p className="text-xs text-muted-foreground">
                  Los campos con <span className="text-destructive">*</span> son obligatorios.
                </p>
                {/*
                  variant="petrol", no un style inline con el color de fondo.
                  El parche pintaba petróleo pero dejaba el texto en
                  `text-brand-ink` de la variante `default`: tinta oscura sobre
                  petróleo oscuro, 1.80:1. Ilegible.
                */}
                <Button
                  type="submit"
                  variant="petrol"
                  size="cta"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer sm:w-auto"
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
