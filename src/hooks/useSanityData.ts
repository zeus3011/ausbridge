import { useQuery } from '@tanstack/react-query';
import { fetchHomepage } from '../queries';

/**
 * Custom hooks for fetching Sanity data
 * Integrated with React Query for caching, refetching, and state management
 */

// ===== MAIN HOMEPAGE HOOK =====
export function useHomepage() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: fetchHomepage,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
