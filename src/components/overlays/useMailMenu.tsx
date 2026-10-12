import { siteConfig, type MailService } from "../../config/site";
import { useQuickActions } from "../../hooks/useQuickActions";
import { useI18n } from "../../i18n/useI18n";
import { mailServiceName } from "../../lib/mail";
import { CopyIcon, MailIcon } from "../ui/Icons";
import type { MenuEntry } from "./OverlayContext";

/** "Email me with Gmail / Outlook" and "Copy address", configured service first. */
export function useMailMenu(): () => MenuEntry[] {
  const { t } = useI18n();
  const { openMail, copyEmail } = useQuickActions();
  const services: MailService[] =
    siteConfig.mailService === "gmail" ? ["gmail", "outlook"] : ["outlook", "gmail"];

  return () => [
    ...services.map((service) => ({
      label: t("menu.emailWith", { service: mailServiceName(service) }),
      icon: <MailIcon />,
      onSelect: () => openMail(service),
    })),
    { label: t("menu.copyEmail"), icon: <CopyIcon />, onSelect: copyEmail },
  ];
}
