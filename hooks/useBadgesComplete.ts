import { useState, useEffect } from 'react';
import { Badge, getBadges } from '@/lib/badges';

export const useBadgesComplete = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        const data = await getBadges();
        setBadges(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, []);

  return { badges, isLoading, error };
};