import type React from 'react';
import { MonetizeSlot } from '@/components/MonetizeSlot';

// MDX 组件类型定义
type MDXComponents = {
  [key: string]: React.ComponentType<any> | React.ReactElement | null;
};

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    MonetizeSlot,
    ...components
  };
}




