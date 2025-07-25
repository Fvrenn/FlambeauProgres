import { useState, useEffect } from 'react';
import { BadgeComplete, getBadgesComplete } from '@/lib/badges';

export const useBadgesComplete = () => {
  const [badges, setBadges] = useState<BadgeComplete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        const data = await getBadgesComplete();
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