import { useQuery } from '@tanstack/react-query';
import { getBadges, getBadge } from '@/src/lib/badges';
import type { Badge } from '@/src/types/badge';

export function useBadges() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    badges: data ?? [],
    error: error ? (error instanceof Error ? error.message : 'Erreur lors du chargement des badges') : null,
    isLoading,
  };
}

export function useBadge(id: string) {
  return useQuery({
    queryKey: ['badges', id],
    queryFn: () => getBadge(id),
    enabled: !!id,
  });
}