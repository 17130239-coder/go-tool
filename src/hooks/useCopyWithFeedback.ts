import { useState } from 'react';
import { useCopyToClipboard } from './useCopyToClipboard';

/**
 * Extends `useCopyToClipboard` with per-key visual feedback.
 *
 * Usage:
 * ```tsx
 * const { copiedKey, handleCopy } = useCopyWithFeedback<'hex' | 'rgb'>();
 * <CopyButton copied={copiedKey === 'hex'} onCopy={() => handleCopy('hex', value)} />
 * ```
 *
 * After a successful copy, `copiedKey` is set to the given key for `timeout` ms,
 * then automatically resets to `null`.
 */
export function useCopyWithFeedback<T extends string>(timeout = 2000) {
  const { copy } = useCopyToClipboard(timeout);
  const [copiedKey, setCopiedKey] = useState<T | null>(null);

  const handleCopy = async (key: T, value: string) => {
    const result = await copy(value);
    if (result.success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), timeout);
    }
  };

  return { copiedKey, handleCopy };
}
