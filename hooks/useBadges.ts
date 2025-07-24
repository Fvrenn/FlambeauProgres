import useSWR from "swr";
import { getBadges, BadgeImage } from "@/lib/badges";

export function useBadges() {
  const { data, error, isLoading } = useSWR<BadgeImage[]>("badges", getBadges);

  return {
    badges: data ?? [],
    error,
    isLoading,
  };
}
