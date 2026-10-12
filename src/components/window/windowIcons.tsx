import type { ComponentType, SVGProps } from "react";
import type { WindowId } from "../../os/types";
import {
  DocumentIcon,
  GlobeIcon,
  ImageIcon,
  SparkleIcon,
  StarIcon,
  UserIcon,
} from "../ui/Icons";

export const windowIcons: Record<WindowId, ComponentType<SVGProps<SVGSVGElement>>> = {
  browser: GlobeIcon,
  profile: UserIcon,
  about: DocumentIcon,
  skills: SparkleIcon,
  favorites: StarIcon,
  viewer: ImageIcon,
};
