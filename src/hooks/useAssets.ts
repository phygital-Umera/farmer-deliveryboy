import {api} from '@/utils/axios';
import {useQuery} from '@tanstack/react-query';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  expiry?: string;
  lastPrice?: number;
  instrumentsToken: string;
}

/**
 * Shared hook to fetch assets from /customer/assets.
 * React Query will deduplicate and cache this across all components
 * that use the same queryKey ['assets'].
 */
export const useAssets = () => {
  return useQuery<{assets: Asset[]}>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/customer/assets');
      return response.data;
    },
  });
};

/**
 * Find asset name by instrumentsToken (the WebSocket/URL token).
 */
export const getAssetNameByToken = (
  assets: Asset[] | undefined,
  instrumentsToken: string,
): string => {
  if (!assets) return '';
  const asset = assets.find(
    (a) => String(a.instrumentsToken) === String(instrumentsToken),
  );
  return asset?.name || '';
};

/**
 * Find asset name by asset ID (UUID used in order data).
 */
export const getAssetNameById = (
  assets: Asset[] | undefined,
  assetId: string,
): string => {
  if (!assets) return '';
  const asset = assets.find((a) => a.instrumentsToken === assetId);
  return asset?.name || '';
};
