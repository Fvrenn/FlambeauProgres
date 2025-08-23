import { useQuery } from '@tanstack/react-query';
import { getReferents } from '@/src/lib/referents';
import type { Referent } from '@/src/types/referent';

export function useReferents() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['referents'],
    queryFn: getReferents,
    staleTime: 5 * 60 * 1000,
  });

  return {
    referents: data ?? [],
    error: error ? (error instanceof Error ? error.message : 'Erreur lors du chargement des référents') : null,
    isLoading,
  };
}