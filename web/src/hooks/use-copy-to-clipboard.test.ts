import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCopyToClipboard } from './use-copy-to-clipboard';

describe('useCopyToClipboard', () => {
  it('should initialize with isCopied as false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.isCopied).toBe(false);
  });

  it('should have copyToClipboard function', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(typeof result.current.copyToClipboard).toBe('function');
  });

  it('should maintain stable copyToClipboard reference', () => {
    const { result, rerender } = renderHook(() => useCopyToClipboard());
    const firstRenderCallback = result.current.copyToClipboard;

    rerender();

    expect(result.current.copyToClipboard).toBe(firstRenderCallback);
  });
});
