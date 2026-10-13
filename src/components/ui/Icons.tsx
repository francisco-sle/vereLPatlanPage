import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

const strokeBase = (props: IconProps): IconProps => ({
  ...base(props),
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const MinimizeIcon = (props: IconProps) => (
  <svg viewBox="0 0 18 18" {...base(props)}>
    <rect x="0.6" y="13" width="17.2" height="4.3" rx="1.6" />
  </svg>
);

export const MaximizeIcon = (props: IconProps) => (
  <svg viewBox="0 0 18 18" {...base(props)}>
    <path d="M.4.4h17.2v17.2H.4V.4Zm2.2 4.3v10.8h12.9V4.7H2.6Z" />
  </svg>
);

export const RestoreIcon = (props: IconProps) => (
  <svg viewBox="0 0 18 18" {...base(props)}>
    <path d="M4.5.4h13.1v13.1h-3.3v-2.1h1.2V3.9H6.6v1H4.5V.4Z" />
    <path d="M.4 5.4h12.1v12.2H.4V5.4Zm2 3.3v6.9h8.1V8.7H2.4Z" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg viewBox="0 0 18 18" {...base(props)}>
    <path d="m10.4 9 6.8 6.8v1.8h-1.8L8.6 10.8l-6.8 6.8H0v-1.8L6.8 9 0 2.2V.4h1.8l6.8 6.8L15.4.4h1.8v1.8L10.4 9Z" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
  <svg viewBox="0 0 31 31" {...base(props)}>
    <path d="M22.46 27a1.2 1.2 0 0 1-.58-.13l-6.41-3.36-6.41 3.36a1.24 1.24 0 0 1-1.8-1.33l1.26-7.08-5.18-5.03a1.24 1.24 0 0 1 .7-2.11l7.16-1.04 3.16-6.45a1.24 1.24 0 0 1 2.26 0l3.2 6.44 7.16 1.04a1.24 1.24 0 0 1 .7 2.1l-5.18 5.04 1.26 7.08a1.24 1.24 0 0 1-1.3 1.47Z" />
  </svg>
);

export const StarOutlineIcon = (props: IconProps) => (
  <svg viewBox="0 0 31 31" {...base(props)}>
    <path
      d="M22.46 27a1.2 1.2 0 0 1-.58-.13l-6.41-3.36-6.41 3.36a1.24 1.24 0 0 1-1.8-1.33l1.26-7.08-5.18-5.03a1.24 1.24 0 0 1 .7-2.11l7.16-1.04 3.16-6.45a1.24 1.24 0 0 1 2.26 0l3.2 6.44 7.16 1.04a1.24 1.24 0 0 1 .7 2.1l-5.18 5.04 1.26 7.08a1.24 1.24 0 0 1-1.3 1.47Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)} strokeWidth={3}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)} strokeWidth={2.5}>
    <path d="M15 5 8 12l7 7" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)} strokeWidth={2.5}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ExternalIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)} strokeWidth={2.5}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

export const WindowsIcon = (props: IconProps) => (
  <svg viewBox="0 0 20 20" {...base(props)}>
    <path d="M11.25 20v-8.75H20V20h-8.75Zm0-20H20v8.75h-8.75V0ZM0 11.25h8.75V20H0v-8.75ZM0 0h8.75v8.75H0V0Z" />
  </svg>
);

export const FolderIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base(props)}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2h8A1.5 1.5 0 0 1 21 8.5V9H3V6.5Z" opacity=".55" />
    <path d="M3 9.5h18v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-8Z" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
  </svg>
);

export const DesktopIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);

export const TrashIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const GlobeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
  </svg>
);

export const UserIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
  </svg>
);

export const DocumentIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M6 3h8l4 4v14H6V3Z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);

export const SparkleIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base(props)}>
    <path d="M12 2c.6 4.6 2.4 7.4 8 8.5v1C14.4 12.6 12.6 15.4 12 20h-.1c-.6-4.6-2.4-7.4-8-8.5v-1c5.6-1.1 7.4-3.9 8-8.5H12Z" />
  </svg>
);

export const ImageIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 16-5-5-9 9" />
  </svg>
);

export const ResetIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6" />
    <path d="M4 4v4.6h4.6" />
  </svg>
);

export const PowerIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M12 3v8" />
    <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
  </svg>
);

export const SoundOnIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M4 9h4l5-4v14l-5-4H4V9Z" fill="currentColor" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

export const SoundOffIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M4 9h4l5-4v14l-5-4H4V9Z" fill="currentColor" />
    <path d="m17 9.5 5 5M22 9.5l-5 5" />
  </svg>
);

export const LanguageIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...strokeBase(props)}>
    <path d="M4 5h9M8.5 3v2M6 5c.6 3.5 3 6.5 6 8M11 5c-.6 3.5-3 6.5-6.5 8" />
    <path d="m13 21 4-9 4 9M14.4 18h5.2" />
  </svg>
);

export const TwitterIcon = (props: IconProps) => (
  <svg viewBox="0 0 42 36" {...strokeBase(props)} strokeWidth={3}>
    <path d="M39 3c-1.7 1-3.4 1.9-4.8 2.4A8.5 8.5 0 0 0 20.9 10v1.9A20 20 0 0 1 6.3 4.3S1.2 15.8 12.7 21a23 23 0 0 1-9.6 6.8C11 32 21 31.3 28 26.5c4.8-3.3 8.3-9 8.3-16.1 0-.5 0-1-.1-1.5C37.9 7.2 39 3 39 3Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 35 35" {...base(props)}>
    <path d="M17.5 8.53a8.97 8.97 0 1 0 0 17.94 8.97 8.97 0 0 0 0-17.94Zm0 14.8a5.84 5.84 0 1 1 0-11.67 5.84 5.84 0 0 1 0 11.68ZM28.94 8.16a2.09 2.09 0 1 1-4.19 0 2.09 2.09 0 0 1 4.19 0Zm5.94 2.12c-.13-2.8-.77-5.28-2.82-7.33C30 .9 27.53.26 24.72.12c-2.89-.16-11.55-.16-14.44 0C7.49.26 5 .9 2.95 2.94.9 4.99.26 7.47.12 10.28c-.16 2.89-.16 11.55 0 14.44.14 2.8.78 5.28 2.83 7.33 2.05 2.05 4.53 2.69 7.33 2.83 2.9.16 11.55.16 14.44 0 2.81-.14 5.29-.78 7.34-2.83 2.04-2.05 2.68-4.53 2.82-7.33.17-2.9.17-11.54 0-14.44ZM31.15 27.82a5.9 5.9 0 0 1-3.33 3.32c-2.3.92-7.77.7-10.32.7-2.55 0-8.02.21-10.31-.7a5.9 5.9 0 0 1-3.33-3.32c-.91-2.31-.7-7.77-.7-10.32 0-2.55-.2-8.02.7-10.32a5.9 5.9 0 0 1 3.33-3.32c2.3-.92 7.76-.7 10.31-.7 2.55 0 8.03-.21 10.32.7a5.9 5.9 0 0 1 3.33 3.32c.91 2.3.7 7.77.7 10.32 0 2.55.21 8.02-.7 10.32Z" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 41 40" {...strokeBase(props)} strokeWidth={3}>
    <path d="M30.5 21.3v-.3c0-.4-.1-.9-.4-1.3-.3-.5-.9-.9-1.6-.9h-3V16.4h3.2c.4 0 1-.1 1.4-.6.5-.4.6-1 .6-1.4v-4.1c0-.4-.1-1-.6-1.4-.4-.5-1-.6-1.4-.6H24c-3.8 0-6.8 2.8-6.8 6.6V19h-1.4c-.4 0-1 .1-1.5.6-.5.4-.6 1-.6 1.4v3.2c0 .4.1 1 .6 1.5.5.4 1 .5 1.5.5h1.4v12.3h8.3V26.1h2.3c.5 0 .9-.2 1.1-.3l.5-.4c.1-.2.4-.5.4-.9l.7-3.2Z" />
    <path d="M15.3 38.5h10.5c4.5 0 8-.9 10.4-3.2 2.4-2.3 3.3-5.8 3.3-10.2V14.9c0-4.4-.9-7.9-3.3-10.2C33.8 2.4 30.3 1.5 25.8 1.5H15.3c-4.6 0-8.1.9-10.5 3.2C2.4 7 1.5 10.5 1.5 14.9v10.2c0 4.4.9 7.9 3.3 10.2 2.4 2.3 5.9 3.2 10.5 3.2Z" />
  </svg>
);
