/**
 * NovaEstate Mobile - Custom Haptics Hook
 */

import { triggerHaptic } from '@/utils/haptics';

export function useHaptics() {
  return triggerHaptic;
}

export default useHaptics;
