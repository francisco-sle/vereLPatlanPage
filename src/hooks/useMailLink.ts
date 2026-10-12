import { siteConfig, type MailService } from "../config/site";
import { useI18n } from "../i18n/useI18n";
import { composeUrl } from "../lib/mail";
import { playSound } from "../sound/sound";

/** Props for a link that opens a new email to the site owner in webmail. */
export function useMailLink() {
  const { t } = useI18n();
  const subject = t("contact.defaultSubject");

  const linkProps = (service: MailService = siteConfig.mailService) => ({
    href: composeUrl(subject, service),
    target: "_blank",
    rel: "noreferrer",
    onClick: () => playSound("open"),
  });

  /** For menus and search, which act on select rather than render a link. */
  const openMail = (service: MailService = siteConfig.mailService) => {
    playSound("open");
    window.open(composeUrl(subject, service), "_blank", "noopener,noreferrer");
  };

  return { linkProps, openMail };
}
