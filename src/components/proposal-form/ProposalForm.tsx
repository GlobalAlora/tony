"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FIELD_CLASSES, fieldBorderClass } from "@/components/proposal-form/FormField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGE_LABELS,
  BUDGET_RANGE_VALUES,
  CAMPAIGN_TYPE_LABELS,
  CAMPAIGN_TYPE_VALUES,
  PLATFORM_LABELS,
  PLATFORM_VALUES,
} from "@/lib/constants/form-options";
import { SECTION_IDS } from "@/lib/constants/site";
import {
  proposalFormSchema,
  type ProposalFormValues,
} from "@/lib/validations/proposal";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ProposalForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    mode: "onBlur",
    defaultValues: {
      brand_name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      platforms: [],
      estimated_date: "",
      message: "",
      website: "",
      renderedAt: Date.now(),
    },
  });

  async function onSubmit(values: ProposalFormValues) {
    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: { success: boolean; error?: string } = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "No pudimos enviar la propuesta.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado. Probá de nuevo.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="mx-auto flex max-w-xl flex-col items-center rounded-[var(--radius-card)] border border-line bg-surface-raised p-10 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth={2.5}
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">
          Propuesta enviada
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          Gracias por escribir. Vas a recibir un email de confirmación, y
          Tony va a responder directamente a tu casilla en los próximos
          días.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="focus-ring mt-6 text-sm font-semibold text-accent hover:underline"
        >
          Enviar otra propuesta
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        headingId="proposal-form-heading"
        eyebrow="Propuesta"
        title="Contame tu idea"
        lead="Completá el formulario con el brief — cuanto más detalle, más rápida la respuesta."
        align="center"
        className="mx-auto"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 space-y-5 rounded-[var(--radius-card)] border border-line bg-surface-raised p-6 sm:p-8"
      >
        {serverError ? (
          <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {serverError}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="brand_name" label="Marca / empresa" error={errors.brand_name?.message}>
            <input
              id="brand_name"
              type="text"
              autoComplete="organization"
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.brand_name?.message))}
              aria-invalid={!!errors.brand_name}
              aria-describedby={errors.brand_name ? "brand_name-error" : undefined}
              {...register("brand_name")}
            />
          </FormField>

          <FormField id="contact_name" label="Nombre y cargo" error={errors.contact_name?.message}>
            <input
              id="contact_name"
              type="text"
              placeholder="Ej: Marina Gómez, Marketing Manager"
              autoComplete="name"
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.contact_name?.message))}
              aria-invalid={!!errors.contact_name}
              aria-describedby={errors.contact_name ? "contact_name-error" : undefined}
              {...register("contact_name")}
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="contact_email" label="Email de contacto" error={errors.contact_email?.message}>
            <input
              id="contact_email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.contact_email?.message))}
              aria-invalid={!!errors.contact_email}
              aria-describedby={errors.contact_email ? "contact_email-error" : undefined}
              {...register("contact_email")}
            />
          </FormField>

          <FormField id="contact_phone" label="Teléfono / WhatsApp" optional error={errors.contact_phone?.message}>
            <input
              id="contact_phone"
              type="tel"
              autoComplete="tel"
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.contact_phone?.message))}
              {...register("contact_phone")}
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="campaign_type" label="Tipo de campaña" error={errors.campaign_type?.message}>
            <select
              id="campaign_type"
              defaultValue=""
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.campaign_type?.message))}
              aria-invalid={!!errors.campaign_type}
              aria-describedby={errors.campaign_type ? "campaign_type-error" : undefined}
              {...register("campaign_type")}
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {CAMPAIGN_TYPE_VALUES.map((value) => (
                <option key={value} value={value}>
                  {CAMPAIGN_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="budget_range" label="Presupuesto estimado" error={errors.budget_range?.message}>
            <select
              id="budget_range"
              defaultValue=""
              className={cn(FIELD_CLASSES, fieldBorderClass(errors.budget_range?.message))}
              aria-invalid={!!errors.budget_range}
              aria-describedby={errors.budget_range ? "budget_range-error" : undefined}
              {...register("budget_range")}
            >
              <option value="" disabled>
                Seleccioná un rango
              </option>
              {BUDGET_RANGE_VALUES.map((value) => (
                <option key={value} value={value}>
                  {BUDGET_RANGE_LABELS[value]}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField id="platforms" label="Plataformas de interés" error={errors.platforms?.message}>
          <div className="flex flex-wrap gap-3" role="group" aria-labelledby="platforms-label">
            {PLATFORM_VALUES.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-medium text-ink has-[:checked]:border-accent has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent has-[:focus-visible]:outline-offset-2"
              >
                <input
                  type="checkbox"
                  value={value}
                  className="h-3.5 w-3.5 accent-[var(--color-accent)]"
                  {...register("platforms")}
                />
                {PLATFORM_LABELS[value]}
              </label>
            ))}
          </div>
        </FormField>

        <FormField id="estimated_date" label="Fecha estimada de campaña" optional error={errors.estimated_date?.message}>
          <input
            id="estimated_date"
            type="date"
            className={cn(FIELD_CLASSES, fieldBorderClass(errors.estimated_date?.message))}
            {...register("estimated_date")}
          />
        </FormField>

        <FormField id="message" label="Mensaje / brief" optional error={errors.message?.message}>
          <textarea
            id="message"
            rows={4}
            placeholder="Contanos el objetivo de la campaña, referencias, o cualquier detalle que ayude."
            className={cn(FIELD_CLASSES, fieldBorderClass(errors.message?.message), "resize-y")}
            {...register("message")}
          />
        </FormField>

        {/* Honeypot — hidden from sighted users and keyboard nav; bots that autofill every field trip it. */}
        <div className="h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          <label htmlFor="website">No completar este campo</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <input type="hidden" {...register("renderedAt", { valueAsNumber: true })} />

        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-ink transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:bg-ink hover:text-surface active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "submitting" ? "Enviando…" : "Enviar propuesta"}
        </button>
      </form>
    </div>
  );
}
