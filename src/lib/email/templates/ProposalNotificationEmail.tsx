import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import type { ProposalEmailData } from "@/lib/email/templates/types";

const ROW_LABEL_STYLE = { color: "#6b6b6b", fontSize: "13px", margin: "0" };
const ROW_VALUE_STYLE = {
  color: "#111111",
  fontSize: "15px",
  margin: "2px 0 16px",
  fontWeight: 600,
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Text style={ROW_LABEL_STYLE}>{label}</Text>
      <Text style={ROW_VALUE_STYLE}>{value}</Text>
    </>
  );
}

export function ProposalNotificationEmail({
  brandName,
  contactName,
  contactEmail,
  contactPhone,
  campaignTypeLabel,
  platformLabels,
  budgetRangeLabel,
  estimatedDateLabel,
  message,
}: ProposalEmailData) {
  return (
    <Html>
      <Head />
      <Preview>Nueva propuesta de {brandName}</Preview>
      <Body style={{ backgroundColor: "#f4f4f4", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "480px",
            margin: "24px auto",
          }}
        >
          <Heading style={{ fontSize: "20px", margin: "0 0 4px" }}>
            Nueva propuesta de marca
          </Heading>
          <Text style={{ color: "#6b6b6b", fontSize: "14px", margin: "0 0 24px" }}>
            Llegó a través del media kit.
          </Text>

          <Row label="Marca / empresa" value={brandName} />
          <Row label="Contacto" value={contactName} />
          <Row
            label="Email"
            value={contactEmail}
          />
          {contactPhone ? <Row label="Teléfono / WhatsApp" value={contactPhone} /> : null}
          <Row label="Tipo de campaña" value={campaignTypeLabel} />
          <Row label="Plataformas" value={platformLabels.join(", ")} />
          <Row label="Presupuesto estimado" value={budgetRangeLabel} />
          {estimatedDateLabel ? (
            <Row label="Fecha estimada" value={estimatedDateLabel} />
          ) : null}

          {message ? (
            <>
              <Text style={ROW_LABEL_STYLE}>Mensaje</Text>
              <Text
                style={{
                  color: "#111111",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "2px 0 16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {message}
              </Text>
            </>
          ) : null}

          <Hr style={{ borderColor: "#e6e6e6", margin: "24px 0" }} />

          <Text style={{ fontSize: "13px", color: "#6b6b6b", margin: 0 }}>
            Respondé directamente a este email — el &quot;Responder&quot; ya
            va a {contactEmail} —, o gestioná el estado de esta propuesta
            desde el Table Editor de Supabase.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ProposalNotificationEmail;
