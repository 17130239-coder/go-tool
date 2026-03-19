import { useState } from 'react';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<{ success: boolean; error?: Error }>;
  reset: () => void;
}

/**
 * Hook for copy to clipboard functionality with visual feedback
 * @param timeout Duration in ms to show "copied" state (default: 2000)
 */
export function useCopyToClipboard(timeout = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<{ success: boolean; error?: Error }> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Copy failed'),
      };
    }
  };

  const reset = () => {
    setCopied(false);
  };

  return { copied, copy, reset };
}
