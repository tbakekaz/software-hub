"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 动态导入 react-markdown 以避免在 Edge Runtime 中打包
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
});

type Props = {
  content: string;
};

export function MarkdownContent({ content }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 在客户端挂载前显示纯文本
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return <ReactMarkdown>{content}</ReactMarkdown>;
}

