import {
  ShieldCheck,
  ClipboardList,
  Eye,
  Award,
  BadgeCheck,
  ScrollText,
  Layers,
  DollarSign,
  HeartHandshake,
  Calendar,
  BookOpen,
  PlayCircle,
  FileText,
  Star,
  Briefcase,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  Check,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  ClipboardList,
  Eye,
  Award,
  BadgeCheck,
  ScrollText,
  Layers,
  DollarSign,
  HeartHandshake,
  Calendar,
  BookOpen,
  PlayCircle,
  FileText,
  Star,
  Briefcase,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  Check,
};

export const iconNames = Object.keys(iconMap);

export function getIcon(name: string | undefined, fallback: LucideIcon = FileText): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] ?? fallback;
}