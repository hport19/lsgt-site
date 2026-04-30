import nodemailer from "nodemailer";

export function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.TICKETS_FROM || process.env.SMTP_FROM,
  };
}

export function missingSmtpConfig() {
  const config = getSmtpConfig();
  return {
    SMTP_HOST: !config.host,
    SMTP_USER: !config.user,
    SMTP_PASS: !config.pass,
    TICKETS_FROM: !config.from,
  };
}

export function assertEmailReady() {
  const missing = missingSmtpConfig();
  if (Object.values(missing).some(Boolean)) {
    return { ok: false as const, missing };
  }
  return { ok: true as const, config: getSmtpConfig() };
}

export function createMailer() {
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
}
