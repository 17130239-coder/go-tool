import { useState } from 'react';

interface UseInputOutputReturn {
  input: string;
  setInput: (value: string) => void;
  output: string;
  setOutput: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clear: () => void;
  clearOutput: () => void;
}

/**
 * Hook for managing input/output state in formatter components
 * @param initialInput Initial input value (default: '')
 */
export function useInputOutput(initialInput = ''): UseInputOutputReturn {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const clearOutput = () => {
    setOutput('');
  };

  return {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    clear,
    clearOutput,
  };
}
