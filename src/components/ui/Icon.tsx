import { icons, type LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

/**
 * Render a Lucide icon by name (used by config-driven navigation).
 * Falls back to a Circle if the name is unknown.
 */
export function Icon({ name, ...props }: IconProps) {
  const Cmp = (icons as Record<string, React.ComponentType<LucideProps>>)[name] ?? icons.Circle;
  return <Cmp aria-hidden {...props} />;
}
