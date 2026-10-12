/** Software skills shown in the "Software Skills" window (level is 0–100). */
import afterEffectsIcon from "../assets/icons/skills/after-effects.svg";
import dreamweaverIcon from "../assets/icons/skills/dreamweaver.svg";
import figmaIcon from "../assets/icons/skills/figma.svg";
import illustratorIcon from "../assets/icons/skills/illustrator.svg";
import photoshopIcon from "../assets/icons/skills/photoshop.svg";

export interface Skill {
  name: string;
  icon: string;
  level: number;
}

export const skills: Skill[] = [
  { name: "Adobe Photoshop", icon: photoshopIcon, level: 85 },
  { name: "Adobe Dreamweaver", icon: dreamweaverIcon, level: 35 },
  { name: "Adobe Illustrator", icon: illustratorIcon, level: 85 },
  { name: "Figma", icon: figmaIcon, level: 75 },
  { name: "Adobe After Effects", icon: afterEffectsIcon, level: 50 },
];
