/**
 * @module components/ui
 * Composants UI réutilisables basés sur tailwind-variants.
 *
 * Chaque composant expose :
 *  - Le composant React
 *  - Les variantes (via `tailwind-variants`)
 *  - Les types TypeScript (Props, Variants)
 *
 * Usage :
 *   import { Button, Badge, Card, CardHeader, CardBody, CardFooter } from "@/components/ui";
 */

export { Button,      type ButtonProps,    type ButtonVariants,    buttonVariants    } from "./button";
export { Badge,       type BadgeProps,     type BadgeVariants,     badgeVariants     } from "./badge";
export { Avatar,      type AvatarProps                                              } from "./avatar";
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  type CardProps,
  type CardVariants,
  cardVariants,
} from "./card";
