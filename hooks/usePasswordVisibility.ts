// hooks/usePasswordVisibility.ts
import { useState, useCallback } from 'react';

export interface UsePasswordVisibilityReturn {
  isVisible: boolean;
  type: 'password' | 'text';
  toggleVisibility: () => void;
}

export const usePasswordVisibility = (initialVisible: boolean = false): UsePasswordVisibilityReturn => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    isVisible,
    type: isVisible ? 'text' : 'password',
    toggleVisibility,
  };
};