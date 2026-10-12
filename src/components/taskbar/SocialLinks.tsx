import type { ComponentType, SVGProps } from "react";
import { siteConfig, type SocialId } from "../../config/site";
import { useI18n } from "../../i18n/useI18n";
import { useMailLink } from "../../hooks/useMailLink";
import { FacebookIcon, InstagramIcon, MailIcon, TwitterIcon } from "../ui/Icons";

const icons: Record<SocialId, ComponentType<SVGProps<SVGSVGElement>>> = {
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

interface Props {
  className?: string;
  linkClassName?: string;
  /** Render links as menu items (inside the start menu). */
  asMenuItems?: boolean;
}

export function SocialLinks({ className, linkClassName, asMenuItems }: Props) {
  const { linkProps } = useMailLink();
  const { t } = useI18n();
  return (
    <ul className={className} role={asMenuItems ? "none" : undefined}>
      {/* Email first: the quickest way to get in touch. */}
      <li role={asMenuItems ? "none" : undefined}>
        <a
          className={linkClassName}
          {...linkProps()}
          role={asMenuItems ? "menuitem" : undefined}
          tabIndex={asMenuItems ? -1 : undefined}
          aria-label={`${t("taskbar.email")} (${t("a11y.newTab")})`}
          title={t("menu.emailMe")}
        >
          <MailIcon />
        </a>
      </li>
      {siteConfig.socials.map(({ id, label, url }) => {
        const Icon = icons[id];
        return (
          <li key={id} role={asMenuItems ? "none" : undefined}>
            <a
              className={linkClassName}
              role={asMenuItems ? "menuitem" : undefined}
              tabIndex={asMenuItems ? -1 : undefined}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
