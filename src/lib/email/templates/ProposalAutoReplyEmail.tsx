import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { CREATOR } from "@/lib/constants/creator-data";
import type { ProposalEmailData } from "@/lib/email/templates/types";

export function ProposalAutoReplyEmail({
  brandName,
  contactName,
  campaignTypeLabel,
  platformLabels,
}: ProposalEmailData) {
  const firstName = contactName.split(" ")[0] ?? contactName;

  return (
    <Html>
      <Head />
      <Preview>Recibimos tu propuesta para {CREATOR.displayName}</Preview>
      <Body style={{ backgroundColor: "#0d0d0e", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#17171a",
            padding: "32px",
            borderRadius: "16px",
            maxWidth: "480px",
            margin: "24px auto",
            border: "1px solid #2a2a2e",
          }}
        >
          <Text
            style={{
              color: "#d4ff3f",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            {CREATOR.displayName}
          </Text>

          <Heading style={{ color: "#ffffff", fontSize: "22px", margin: "0 0 16px" }}>
            ¡Gracias, {firstName}!
          </Heading>

          <Text style={{ color: "#c9c9cc", fontSize: "15px", lineHeight: "1.6" }}>
            Recibimos la propuesta de <strong style={{ color: "#ffffff" }}>{brandName}</strong>{" "}
            para una campaña de tipo <strong style={{ color: "#ffffff" }}>{campaignTypeLabel}</strong>{" "}
            en {platformLabels.join(" y ")}.
          </Text>

          <Text style={{ color: "#c9c9cc", fontSize: "15px", lineHeight: "1.6" }}>
            {CREATOR.displayName} revisa cada propuesta personalmente y te va
            a responder directamente a esta casilla en los próximos días.
          </Text>

          <Section
            style={{
              backgroundColor: "#0d0d0e",
              borderRadius: "10px",
              padding: "16px 20px",
              margin: "24px 0",
            }}
          >
            <Text style={{ color: "#8a8a8f", fontSize: "13px", margin: 0 }}>
              Si necesitás agregar algo a la propuesta, simplemente
              respondé este email o escribí a{" "}
              <span style={{ color: "#ffffff" }}>{CREATOR.email}</span>.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#2a2a2e", margin: "24px 0" }} />

          <Text style={{ color: "#6b6b6f", fontSize: "12px", margin: 0 }}>
            Este es un mensaje automático de confirmación de recepción — no
            implica aceptación de la propuesta.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ProposalAutoReplyEmail;
