import {
  Heart,
  Refrigerator,
  Search,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  /** Shorter label for the mobile tab bar. */
  shortLabel: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Browse", shortLabel: "Browse", icon: Search },
  { to: "/fridge", label: "My fridge", shortLabel: "Fridge", icon: Refrigerator },
  { to: "/saved", label: "Saved", shortLabel: "Saved", icon: Heart },
  {
    to: "/shopping-list",
    label: "Shopping list",
    shortLabel: "List",
    icon: ShoppingBasket,
  },
];
