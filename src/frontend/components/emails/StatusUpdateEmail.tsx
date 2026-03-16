import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface StatusUpdateEmailProps {
  studentName: string;
  companyName: string;
  status: string;
  actionUrl: string;
}

export const StatusUpdateEmail = ({
  studentName,
  companyName,
  status,
  actionUrl,
}: StatusUpdateEmailProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SHORTLISTED":
        return "#f59e0b"; // Amber/Orange
      case "SELECTED":
        return "#10b981"; // Emerald/Green
      case "REJECTED":
        return "#ef4444"; // Red
      default:
        return "#6366f1"; // Indigo
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <Html>
      <Head />
      <Preview>Update on your application for {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>CampusHireX Status Update</Heading>
          <Text style={text}>Hi {studentName},</Text>
          <Text style={text}>
            There has been an update to your application for <strong>{companyName}</strong>.
          </Text>
          <Section style={statusSection}>
            <Text style={{ ...statusText, color: statusColor }}>
              Status: {status.replace("_", " ")}
            </Text>
          </Section>
          <Section style={btnContainer}>
            <Link style={button} href={actionUrl}>
              View Details on Dashboard
            </Link>
          </Section>
          <Text style={text}>
            Best of luck with your placement journey!
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            CampusHireX • Automated Placement System
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default StatusUpdateEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 24px 16px",
};

const statusSection = {
  margin: "24px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  textAlign: "center" as const,
};

const statusText = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  margin: "32px auto",
  padding: "14px 7px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "16px",
};
