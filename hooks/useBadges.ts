import useSWR from "swr";
import { getBadges } from "@/lib/badges";
import type { Badge } from "@/types/badge";

export function useBadges() {
  const { data, error, isLoading } = useSWR<Badge[]>("badges", getBadges);

  return {
    badges: data ?? [],
    error,
    isLoading,
  };
}
