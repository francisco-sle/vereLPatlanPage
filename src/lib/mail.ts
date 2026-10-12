import { siteConfig, type MailService } from "../config/site";

const SERVICE_NAMES: Record<MailService, string> = {
  gmail: "Gmail",
  outlook: "Outlook",
};

export const mailServiceName = (service: MailService) => SERVICE_NAMES[service];

/** A link that opens a new message to the site owner in Gmail or Outlook on the web. */
export function composeUrl(subject: string, service: MailService = siteConfig.mailService) {
  const to = encodeURIComponent(siteConfig.email);
  const su = encodeURIComponent(subject);
  return service === "gmail"
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}`
    : `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}`;
}
