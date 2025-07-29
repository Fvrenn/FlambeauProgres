import useSWR from "swr";
import { getBadges } from "@/src/lib/badges";
import type { Badge } from "@/src/types/badge";

export function useBadges() {
  const { data, error, isLoading } = useSWR<Badge[]>("badges", getBadges);

  return {
    badges: data ?? [],
    error,
    isLoading,
  };
}
