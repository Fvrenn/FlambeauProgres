import useSWR from "swr";
import { getBadges, Badge } from "@/lib/badges";

export function useBadges() {
  const { data, error, isLoading } = useSWR<Badge[]>("badges", getBadges);

  return {
    badges: data ?? [],
    error,
    isLoading,
  };
}
