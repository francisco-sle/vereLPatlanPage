import { useCallback } from "react";
import { useOverlays } from "../components/overlays/OverlayContext";
import { siteConfig } from "../config/site";
import { useI18n } from "../i18n/useI18n";
import { copyText } from "../lib/clipboard";
import { clearAllStorage } from "../lib/storage";
import { useDesktop } from "../os/DesktopContext";
import { useMailLink } from "./useMailLink";

/** Actions shared by the start menu and context menus. */
export function useQuickActions() {
  const { actions } = useDesktop();
  const { toast, confirm } = useOverlays();
  const { t } = useI18n();
  const { openMail } = useMailLink();

  const copyEmail = useCallback(async () => {
    const copied = await copyText(siteConfig.email);
    toast(copied ? t("toast.emailCopied") : t("toast.copyFailed", { email: siteConfig.email }));
  }, [toast, t]);

  const resetLayout = useCallback(() => {
    actions.resetLayout();
    toast(t("toast.layoutReset"));
  }, [actions, toast, t]);

  const resetAll = useCallback(async () => {
    const confirmed = await confirm({
      title: t("confirm.resetTitle"),
      message: t("confirm.resetMessage"),
      confirmLabel: t("confirm.resetConfirm"),
    });
    if (!confirmed) return;
    clearAllStorage();
    window.location.assign("/");
  }, [confirm, t]);

  return {
    openMail,
    copyEmail,
    resetLayout,
    resetAll,
  };
}
