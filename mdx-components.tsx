import type { MDXComponents } from 'mdx/types';
import { MonetizeSlot } from '@/components/MonetizeSlot';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    MonetizeSlot,
    ...components
  };
}




